const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

// 连接数据库
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));

// 添加上传路由
app.use('/api/upload', require('./routes/uploadRoutes'));

// 测试路由
app.get('/', (req, res) => {
    res.json({ message: '欢迎访问博客API' });
})

// 错误处理中间件
app.use(require('./middleware/errorHandle'));

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
})