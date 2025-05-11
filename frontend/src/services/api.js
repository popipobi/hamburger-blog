import store from '@/store';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:3000/api';

// 创建axios实例
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 添加请求拦截器
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 处理令牌过期
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // 令牌过期
        if (error.response && error.response.status === 401) {
            // 清除本地存储的令牌和用户信息
            store.commit('logout');

            // 显示通知
            if (store.dispatch) {
                store.dispatch('setSnackbar', {
                    show: true,
                    text: '您的登录已过期，请重新登录',
                    color: 'warning'
                });
            }

            // 若不在登录页面，则重定向到登录页面
            if (router.currentRoute.value.path !== '/login') {
                router.push('/login');
            }
        }

        // 处理网络错误
        if (!error.response) {
            if (store.dispatch) {
                store.dispatch('setSnackbar', {
                    show: true,
                    text: '网络错误，请检查您的网络连接',
                    color: 'error'
                });
            }
        }

        return Promise.reject(error);
    }
)

// 用户API
export const userAPI = {
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
    getProfile: () => api.get('users/profile'),
    updateProfile: (data) => api.put('/users/profile', data) 
};

// 文章API
export const articleAPI = {
    getAll: () => api.get('/articles'),
    getById: (id) => api.get(`/articles/${id}`),
    create: (articleData) => api.post('/articles', articleData),
    update: (id, articleData) => api.put(`/articles/${id}`, articleData),
    delete: (id) => api.delete(`/articles/${id}`)
};

// 评论API
export const commentAPI = {
    getByArticle: (articleId) => api.get(`/comments/article/${articleId}`),
    create: (articleId, commentData) => api.post(`/comments/article/${articleId}`, commentData),
    update: (commentId, commentData) => api.put(`/comments/${commentId}`, commentData),
    delete: (commentId) => api.delete(`/comments/${commentId}`)
};

// 上传API
export const uploadAPI = {
    uploadImage: (formData) => {
        console.log('发送图片上传请求');// for test
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        return api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default api;