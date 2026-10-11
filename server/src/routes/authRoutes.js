const express = require('express');
const router = express.Router();
const { login, register, getMe, getPetAccounts } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/register', register);
router.get('/me', authMiddleware, getMe);
router.get('/pet-accounts', getPetAccounts);

module.exports = router;
