module.exports = (err, req, res, next) => {
    console.error('服务器错误',err.stack);
    res.status(500).json({
        message: '服务器错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
}