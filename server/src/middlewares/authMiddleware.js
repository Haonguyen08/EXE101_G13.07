const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy Token xác thực (Bearer Token). Vui lòng đăng nhập.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'pet_passport_jwt_secret_key_2026_super_secure'
    );

    const account = await Account.findById(decoded.id).populate('roleId');
    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại trên hệ thống.',
      });
    }

    if (account.isBanned) {
      return res.status(403).json({
        success: false,
        message: `Tài khoản đã bị tạm khóa. Lý do: ${account.banReason || 'Vi phạm điều khoản dịch vụ.'}`,
      });
    }

    req.user = account;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
