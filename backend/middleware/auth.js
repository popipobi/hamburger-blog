const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    // 从请求头获取令牌
    const token = req.header('x-auth-token');

    // 检查是否存在令牌
    if (!token) {
        return res.status(401).json({ message: '无访问权限，未提供认证令牌' });
    }

    try {
        // 验证令牌
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ message: '令牌无效' });
    }
};