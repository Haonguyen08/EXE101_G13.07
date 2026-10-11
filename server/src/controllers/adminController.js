const Account = require('../models/Account');
const Profile = require('../models/Profile');
const Pet = require('../models/Pet');

/**
 * @desc    Xem danh sách tất cả tài khoản (Admin)
 * @route   GET /api/admin/accounts
 * @access  Private (ADMIN)
 */
const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find()
      .populate('roleId', 'name description')
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    const formattedAccounts = await Promise.all(
      accounts.map(async (acc) => {
        const [profile, petCount] = await Promise.all([
          Profile.findOne({ accountId: acc._id }),
          Pet.countDocuments({ ownerId: acc._id }),
        ]);

        return {
          _id: acc._id,
          username: acc.username,
          email: acc.email,
          role: acc.roleId?.name || 'PET_OWNER',
          petCount: petCount || 0,
          isBanned: acc.isBanned || false,
          banReason: acc.banReason || '',
          createdAt: acc.createdAt,
          profile: profile || { fullName: acc.username, phone: '' },
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: formattedAccounts.length,
      data: formattedAccounts,
    });
  } catch (error) {
    console.error('[Admin getAllAccounts Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy danh sách tài khoản.',
      error: error.message,
    });
  }
};

/**
 * @desc    Khóa hoặc mở khóa tài khoản
 * @route   PATCH /api/admin/accounts/:id/ban
 * @access  Private (ADMIN)
 */
const toggleBanAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBanned, reason } = req.body;

    const account = await Account.findById(id).populate('roleId');
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản.',
      });
    }

    if (account.roleId?.name === 'ADMIN') {
      return res.status(400).json({
        success: false,
        message: 'Không thể khóa tài khoản Quản trị viên (ADMIN).',
      });
    }

    const newBanStatus = typeof isBanned === 'boolean' ? isBanned : !account.isBanned;
    account.isBanned = newBanStatus;
    account.banReason = newBanStatus ? (reason || 'Vi phạm điều khoản dịch vụ.') : null;
    await account.save();

    return res.status(200).json({
      success: true,
      message: newBanStatus ? 'Đã khóa tài khoản thành công.' : 'Đã mở khóa tài khoản thành công.',
      account: {
        _id: account._id,
        username: account.username,
        isBanned: account.isBanned,
        banReason: account.banReason,
      },
    });
  } catch (error) {
    console.error('[Admin toggleBanAccount Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi cập nhật trạng thái tài khoản.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllAccounts,
  toggleBanAccount,
};
