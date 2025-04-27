const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 用户注册
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 检查用户是否存在
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: '用户已存在' });
        }

        const userCount = await User.countDocuments();

        // 创建新用户
        user = new User({
            username,
            email,
            password,
            role: userCount === 0 ? 'admin' : 'user'// 第一个注册的用户默认为管理员
        });

        await user.save();

        // 创建JWT令牌
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id:user.id, username, email, role: user.role } });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 用户登录
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 查找用户
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }

        // 验证密码
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }

        // 创建JWT令牌
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取当前用户信息
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
    const { email, bio } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }

        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;

        await user.save();
        res.json({user});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};