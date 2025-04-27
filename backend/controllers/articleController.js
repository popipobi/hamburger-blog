const Article = require('../models/Article');
const User = require('../models/User');

// 获取所有文章
exports.getAllArticles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page -1) * limit;

        const articles = await Article.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'username');
        
        const total = await Article.countDocuments();

        res.json({
            articles,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取单篇文章
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'username');

        if (!article) {
            return res.status(404).json({ message: '文章不存在' });
        }

        res.json(article);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: '文章不存在' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
};

// 创建文章
exports.createdArticle = async (req, res) => {
    const { title, content, summary, coverImage, tags } = req.body;

    try {
        // 确保用户存在
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }

        //  创建新文章
        const newArticle = new Article({
            title,
            content,
            summary,
            coverImage,
            author: req.user.id,
            tags: tags || []
        });

        const article = await newArticle.save();

        // 返回新创建的文章
        res.json(article);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 更新文章
exports.updateArticle = async (req, res) => {
    const { title, content, summary, coverImage, tags } = req.body;

    try {
        let article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: '文章不存在' });
        }

        // 检查用户是否有权限更新
        if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: '没有权限编辑该文章' });
        }

        // 更新文章
        if (title) article.title = title;
        if (content) article.content = content;
        if (summary) article.summary = summary;
        if (coverImage) article.coverImage = coverImage;
        if (tags) article.tags = tags;
        article.updateAt = Date.now();

        await article.save();
        res.json(article);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: '文章不存在' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
};

// 删除文章
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: '文章不存在' });
        }

        // 检查用户是否有权限删除
        if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: '没有权限删除该文章' });
        }

        await Article.findByIdAndDelete(req.params.id);
        res.json({ message: '文章已删除' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: '文章不存在' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
};

// 搜索文章
exports.searchArticles = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: '请提供搜索关键词' });
        }

        const articles = await Article.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { summary: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        })
            .sort({ createAt: -1 })
            .populate('author', 'username');

        res.json(articles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};
