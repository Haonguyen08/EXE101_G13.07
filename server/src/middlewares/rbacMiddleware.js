const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roleId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập chức năng này.',
      });
    }

    const userRole = req.user.roleId.name;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Quyền truy cập bị từ chối. Chức năng yêu cầu quyền: ${allowedRoles.join(', ')}.`,
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
