import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
    ? 'api'
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