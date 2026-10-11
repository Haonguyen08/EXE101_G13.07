const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const Role = require('../models/Role');
const Profile = require('../models/Profile');
const Pet = require('../models/Pet');

// Helper to generate JWT
const generateToken = (account) => {
  return jwt.sign(
    {
      id: account._id,
      role: account.roleId?.name || 'PET_OWNER',
    },
    process.env.JWT_SECRET || 'pet_passport_jwt_secret_key_2026_super_secure',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

/**
 * @desc    Đăng nhập tài khoản
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { identifier, username, email, password } = req.body;
    const loginKey = (identifier || username || email || '').trim().toLowerCase();

    if (!loginKey || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ tên đăng nhập/email và mật khẩu.',
      });
    }

    // Tìm tài khoản theo username hoặc email
    const account = await Account.findOne({
      $or: [{ username: loginKey }, { email: loginKey }],
    }).populate('roleId');

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác.',
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác.',
      });
    }

    // Kiểm tra trạng thái khóa tài khoản
    if (account.isBanned) {
      return res.status(403).json({
        success: false,
        message: `Tài khoản đã bị tạm khóa. Lý do: ${account.banReason || 'Vi phạm điều khoản.'}`,
      });
    }

    // Lấy thông tin Profile
    const profile = await Profile.findOne({ accountId: account._id });

    // Lấy danh sách thú cưng của tài khoản này
    const pets = await Pet.find({ ownerId: account._id });

    // Tạo JWT Token
    const token = generateToken(account);

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        _id: account._id,
        username: account.username,
        email: account.email,
        role: account.roleId?.name,
        profile: profile || null,
        pets: pets || [],
      },
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi xử lý đăng nhập.',
      error: error.message,
    });
  }
};

/**
 * @desc    Đăng ký tài khoản chủ nuôi mới (PET_OWNER)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { username, email, password, fullName, phone, address } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ username, email và password.',
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Kiểm tra tồn tại
    const existing = await Account.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập hoặc Email này đã tồn tại trên hệ thống.',
      });
    }

    // Tìm role PET_OWNER
    let petOwnerRole = await Role.findOne({ name: 'PET_OWNER' });
    if (!petOwnerRole) {
      petOwnerRole = await Role.create({
        name: 'PET_OWNER',
        description: 'Chủ sở hữu thú cưng (Pet Owner)',
      });
    }

    // Băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Tạo account
    const newAccount = await Account.create({
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      roleId: petOwnerRole._id,
      isBanned: false,
    });

    // Tạo profile mặc định
    const newProfile = await Profile.create({
      accountId: newAccount._id,
      fullName: fullName?.trim() || cleanUsername,
      phone: phone?.trim() || '',
      address: address?.trim() || '',
      socialLink: '',
    });

    // Tạo token
    const populatedAccount = await Account.findById(newAccount._id).populate('roleId');
    const token = generateToken(populatedAccount);

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      token,
      user: {
        _id: newAccount._id,
        username: newAccount.username,
        email: newAccount.email,
        role: 'PET_OWNER',
        profile: newProfile,
        pets: [],
      },
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi đăng ký tài khoản.',
      error: error.message,
    });
  }
};

/**
 * @desc    Lấy thông tin tài khoản hiện tại + danh sách Pet
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const account = await Account.findById(req.user._id).populate('roleId');
    const profile = await Profile.findOne({ accountId: req.user._id });
    const pets = await Pet.find({ ownerId: req.user._id });

    return res.status(200).json({
      success: true,
      user: {
        _id: account._id,
        username: account.username,
        email: account.email,
        role: account.roleId?.name,
        profile: profile || null,
        pets: pets || [],
      },
    });
  } catch (error) {
    console.error('[Auth GetMe Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin người dùng.',
      error: error.message,
    });
  }
};

/**
 * @desc    Lấy danh sách các tài khoản và Pet liên kết trực tiếp từ MongoDB (không dùng dữ liệu cứng)
 * @route   GET /api/auth/pet-accounts
 * @access  Public
 */
const getPetAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ isBanned: false })
      .populate('roleId', 'name description')
      .select('-passwordHash');

    const accountsWithPets = await Promise.all(
      accounts.map(async (acc) => {
        const [profile, pets] = await Promise.all([
          Profile.findOne({ accountId: acc._id }),
          Pet.find({ ownerId: acc._id }),
        ]);

        return {
          _id: acc._id,
          username: acc.username,
          email: acc.email,
          role: acc.roleId?.name || 'PET_OWNER',
          roleDescription: acc.roleId?.description || '',
          profile: profile || null,
          pets: pets || [],
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: accountsWithPets,
    });
  } catch (error) {
    console.error('[Auth getPetAccounts Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy danh sách tài khoản từ database.',
      error: error.message,
    });
  }
};

module.exports = {
  login,
  register,
  getMe,
  getPetAccounts,
};
