<!-- 首页组件 -->
<template>
    <v-container>
        <h1 class="text-h3 mb-5">最新文章</h1>
        <div v-if="loading" class="text-center">
            <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div v-else-if="error" class="text-center red--text">
            {{ error }}
        </div>
        <div v-else-if="articles.length===0" class="text-center">
            <p>还没有文章，请先创建一些内容</p>
            <v-btn v-if="isLoggedIn" to="/admin" color="primary" class="mt-4">
                创建文章
            </v-btn>
        </div>
        <div v-else>
            <v-row>
                <v-col v-for="article in articles" :key="article.id" cols="12" md="6">
                    <v-card class="mb-4" :to="`/article/${article._id}`">
                        <v-img
                            v-if="article.coverImage"
                            :src="getImageUrl(article.coverImage)"
                            height="200"
                            cover
                        ></v-img>
                        <v-card-title>{{ article.title }}</v-card-title>
                        <v-card-subtitle>
                            {{ formatDate(article.createdAt) }}
                        </v-card-subtitle>
                        <v-card-text>
                            <p>{{ article.summary }}</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="primary" :to="`/article/${article._id}`">
                                阅读全文
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import { articleAPI } from '@/services/api';

export default {
    name: 'HomeView',
    data() {
        return {
            articles: [],
            loading: true,
            error: null
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.state.isLoggedIn;
        }
    },
    created() {
        // 暂时使用虚拟数据，后面会改为API调用
        // setTimeout(() => {
        //     this.articles = [
        //         {
        //             id: 1,
        //             title: 'Linux基础命令入门',
        //             summary: '学习Linux系统中最常用的文件操作命令，包括ls...',
        //             coverImage: 'https://via.placeholder.com/800x400?text=Linux',
        //             createdAt: new Date('2025-04-10')
        //             },
        //             {
        //             id: 2,
        //             title: 'Docker容器化入门指南',
        //             summary: '了解Docker的基本概念和命令，如何构建和运行容器...',
        //             coverImage: 'https://via.placeholder.com/800x400?text=Docker',
        //             createdAt: new Date('2025-04-15')
        //             },
        //             {
        //             id: 3,
        //             title: 'Nginx配置反向代理',
        //             summary: '学习如何使用Nginx设置反向代理，提高网站性能和安全性...',
        //             coverImage: 'https://via.placeholder.com/800x400?text=Nginx',
        //             createdAt: new Date('2025-04-20')
        //             },
        //             {
        //             id: 4,
        //             title: 'Shell脚本编写基础',
        //             summary: '掌握Shell脚本编写的基础知识，实现自动化部署...',
        //             coverImage: 'https://via.placeholder.com/800x400?text=Shell',
        //             createdAt: new Date('2025-04-22')
        //         }]
        //     this.loading = false
        // }, 1000);

        // 实际API调用会是这样
        // axios.get('https://localhost:3000/api/articles')
        //     .then(response => {
        //         this.articles = response.data
        //         this.loading = false
        //     })
        //     .catch(error => {
        //         this.error = '加载文章失败，请稍后再试'
        //         this.loading = false
        //         console.error(error)
        //     })

        this.fetchArticles();
    },
    methods: {
        async fetchArticles() {
            try {
                this.loading = true;
                const response = await articleAPI.getAll();
                this.articles = Array.isArray(response.data)
                    ? response.data
                    : response.data.articles || [];
                this.loading = false;
            } catch (error) {
                console.error('获取文章失败', error);
                this.error = '加载文章失败，请稍后再试';
                this.loading = false;
            }
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
        getImageUrl(path) {
            // 判断是否是完整URL
            if (path.startsWith('http')) {
                return path;
            }
            // 否则拼接完整的URL
            return `http://localhost:3000${path}`;
        }
    }
}
</script>