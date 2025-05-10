const Comment = require('../models/Comment');
const Article = require('../models/Article');
const mongoose = require('mongoose');

// 获取文章所有评论
exports.getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    // 验证文章ID是否有效
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ message: '无效的文章ID' });
    }

    // 查询顶级评论
    const comments = await Comment.find({
      article: articleId,
      parentComment: null
    })
    .populate('author', 'username avatar')
    .sort({ createAt: -1 });

    // 为每个顶级评论查询其回复
    const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
      const replies = await Comment.find({
        parentComment: comment._id
      })
      .populate('author', 'username avatar')
      .sort({ createAt: 1 });

      return {
        ...comment.toObject(),
        replies
      }
    }));

    res.status(200).json(commentsWithReplies);
  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 创建新评论
exports.createComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content, parentComment } = req.body;
    const userId = req.user.id;

    // 验证文章是否存在
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 如果有父评论，验证是否存在
    if (parentComment) {
      const parentCommentExits = await Comment.findById(parentComment);
      if (!parentCommentExits) {
        return res.status(404).json({ message: '父评论不存在' });
      }
    }

    // 创建新评论
    const newComment = new Comment({
      article: articleId,
      author: userId,
      content,
      parentComment: parentComment || null
    });

    await newComment.save();

    // 返回包含作者信息的完整评论信息
    const populatedComment = await Comment.findById(newComment._id)
      .populate('author', 'username avatar');
    
    res.status(201).json(populateComment);
  } catch (error) {
    console.error('创建评论失败:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 删除评论(only作者和管理员)
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }
    
    // 检查是否是评论作者或管理员
    if (comment.author.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: '无权删除该评论' });
    }

    // 开删
    await Comment.deleteMany({
      $or: [
        { _id: commentId },
        { parentComment: commentId }
      ]
    });

    res.status(200).json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论失败:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 编辑评论(only作者)
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: '无权编辑此评论' });
    }

    comment.content = content;
    await comment.save();

    const updateComment = await Comment.findById(commentId)
      .populate('author', 'username avatar');

    res.status(200).json(updateComment);
  } catch (error) {
    console.error('更新评论失败', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};