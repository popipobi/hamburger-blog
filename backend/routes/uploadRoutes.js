const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const path = require('path');
const { log } = require('console');

// @route   POST /api/upload
// @desc    上传图片
// @access  Private
router.post('/', auth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '请上传文件' });
        }

        // 返回正确的文件路径，确保使用正斜杠
        const filePath = `/uploads/${req.file.filename}`;
        console.log('文件上传成功：', filePath);

        res.json({
            message: '文件上传成功',
            filePath: filePath
        });
    } catch (error) {
        console.error('文件上传错误：',error);
        res.status(500).json({ message: '服务器错误' + error.message });
    }
});

module.exports = router;