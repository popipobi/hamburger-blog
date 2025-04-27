const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   POST /api/users/login
// @desc    注册用户
// @access  Public
router.post('/register', userController.register);

// @route   POST /api/users/login
// @desc    用户登录
// @access  Public
router.post('/login', userController.login);

// @route   GET /api/users/profile
// @desc    获取当前用户信息
// @access  Private
router.get('/profile', auth, userController.getProfile);

// @router  PUT /api/users/profile
// @desc    更新用户信息
// @access  Private
router.put('/profile', auth, userController.updateProfile);

module.exports = router;