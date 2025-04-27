const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const auth = require('../middleware/auth');

// @route   GET /api/articles
// @desc    获取所有文章
// @access  Public
router.get('/', articleController.getAllArticles);

// @route   GET /api/articles/:id
// @desc    获取单篇文章
// @access  Public
router.get('/:id', articleController.getArticleById);

// @route   POST /api/articles
// @desc    创建文章
// @access  Private
router.post('/', auth, articleController.createdArticle);

// @route   PUT /api/articles/:id
// @desc    更新文章
// @access  Private
router.put('/:id', auth, articleController.updateArticle);

// @route   DELETE /api/articles/:id
// @desc    删除文章
// @access  Private
router.delete('/:id', auth, articleController.deleteArticle);

// @route   GET /api/articles/search
// @desc    搜素文章
// @access  Public
router.get('/search', articleController.searchArticles);

module.exports = router;