const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');
const auth = require('../middleware/auth');

// @route   GET /api/comments/article/:articleId
// @desc   获取某篇文章所有评论
// @access  Public
router.get('/article/:articleId', commentController.getCommentsByArticle);

// @route   POST /api/comments/article/:articleId
// @desc    创建评论
// @access  Private
router.post('/article/:articleId', auth, commentController.createComment);

// @route   DELETE /api/comments/article/:articleId
// @desc    删除评论
// @access  Private
router.delete('/article/:articleId', auth, commentController.deleteComment);

// @route   PUT /api/comments/:commentId
// @desc    修改评论
// @access  Private
router.put('/:commentId', auth, commentController.updateComment);

module.exports = router;
