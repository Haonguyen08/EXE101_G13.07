const express = require('express');
const router = express.Router();
const { getAllAccounts, toggleBanAccount } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/rbacMiddleware');

// Bảo vệ bằng authMiddleware và authorizeRoles('ADMIN')
router.use(authMiddleware);
router.use(authorizeRoles('ADMIN'));

router.get('/accounts', getAllAccounts);
router.patch('/accounts/:id/ban', toggleBanAccount);

module.exports = router;
