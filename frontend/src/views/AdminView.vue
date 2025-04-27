<!-- 管理后台组件 -->
<template>
    <v-container>
        <h1 class="text-h3 mb-5">管理后台</h1>

        <v-tabs v-model="activeTab" class="mb-6">
            <v-tab value="articles">文章管理</v-tab>
            <v-tab value="profile">个人资料</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
            <v-window-item value="articles">
                <div class="d-flex justify-space-between align-center mb-4">
                    <h2 class="text-h5">文章列表</h2>
                    <v-btn color="primary" prepend-icon="mdi-plus" to="/admin/article/new">新建文章</v-btn>
                </div>

                <div v-if="articlesLoading" class="text-center my-4">
                    <v-progress-circular indeterminate></v-progress-circular>
                </div>

                <v-alert v-if="articlesError" type="error" class="mb-4">
                    {{ articlesError }}
                </v-alert>

                <div v-else-if="articles.length === 0" class="text-center">
                    <p>还没有文章，点击“新建文章”开始创建</p>
                </div>

                <v-table v-else>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>标题</th>
                            <th>创建日期</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="article in articles" :key="article._id">
                            <td>{{ article._id.substring(0, 8) }}...</td>
                            <td>{{ article.title }}</td>
                            <td>{{ formatDate(article.createdAt) }}</td>
                            <td>
                                <v-btn
                                    icon
                                    variant="text"
                                    color="info"
                                    class="mr-2"
                                    title="编辑"
                                    :to="`/admin/article/edit/${article._id}`"
                                >
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn
                                    icon
                                    variant="text"
                                    color="error"
                                    title="删除"
                                    @click="confirmDelete(article)"
                                >
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-window-item>

            <v-window-item value="profile">
                <h2 class="text-h5 mb-4">个人资料</h2>

                <div v-if="profileLoading" class="text-center my-4">
                    <v-progress-circular indeterminate></v-progress-circular>
                </div>

                <v-alert v-if="profileError" type="error" class="mb-4">
                    {{ profileError }}
                </v-alert>

                <v-alert v-if="profileSuccess" type="success" class="mb-4" closable @click:close="profileSuccess = null">
                    {{ profileSuccess }}
                </v-alert>

                <v-card class="pa-4" v-if="profile">
                    <v-form @submit.prevent="updateProfile" ref="profileForm">
                        <v-text-field
                            v-model="profile.username"
                            label="用户名"
                            readonly
                        ></v-text-field>
                        <v-text-field
                            v-model="profile.email"
                            label="邮箱"
                            :rules="[
                                v => !!v || '邮箱不能为空',
                                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '请输入有效的邮箱地址'
                            ]"
                        ></v-text-field>
                        <v-textarea
                            v-model="profile.bio"
                            label="个人简介"
                            rows="4"
                        ></v-textarea>
                        <v-btn color="primary" type="submit" :loading="profileSaving">保存修改</v-btn>
                    </v-form>
                </v-card>
            </v-window-item>
        </v-window>

        <!-- 删除确认对话框 -->
        <v-dialog v-model="deleteDialog" max-width="500">
            <v-card>
                <v-card-title class="text-h5">
                    确认删除
                </v-card-title>
                <v-card-text>
                    确定要删除文章 "{{ articleToDelete?.title }}" 吗? 此操作不可撤销。
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="deleteDialog = false">取消</v-btn>
                    <v-btn color="error" @click="deleteArticle" :loading="deleteLoading">删除</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { articleAPI, userAPI } from '@/services/api';

export default {
    name: 'AdminView',
    data() {
        return {
            // activeTab: 'articles',
            // articles: [
            //     {
            //         id: 1,
            //         title: 'Linux基础命令入门',
            //         createdAt: new Date('2025-4-23')
            //     },
            //     {
            //         id: 2,
            //         title: 'Docker容器化入门指南',
            //         createdAt: new Date('2025-04-15')
            //     },
            //     {
            //         id: 3,
            //         title: 'Nginx配置反向代理',
            //         createdAt: new Date('2025-04-20')
            //     },
            //     {
            //         id: 4,
            //         title: 'Shell脚本编写基础',
            //         createdAt: new Date('2025-04-22')
            //     }
            // ],
            // profile: {
            //     username: 'admin',
            //     email: 'admin@example.com',
            //     bio: '哈哈哈哈'
            // }

            activeTab: 'articles',
            // 文章列表数据
            articles: [],
            articlesLoading: true,
            articlesError: null,
            // 个人资料数据
            profile: null,
            profileLoading: true,
            profileError: null,
            profileSaving: false,
            profileSuccess: null,
            // 删除文章对话框
            deleteDialog: false,
            articleToDelete: null,
            deleteLoading: false
        }
    },
    created() {
        // 检查用户是否登录
        if (!this.$store.state.isLoggedIn) {
            this.$router.push('/login')
            return;
        }

        // 加载数据
        this.fetchArticles();
        this.fetchProfile();
    },
    methods: {
        async fetchArticles() {
            try {
                this.articlesLoading = true;
                const response = await articleAPI.getAll();
                this.articles = Array.isArray(response.data)
                    ? response.data
                    : response.data.articles || [];
                this.articlesLoading = false;
            } catch (error) {
                console.error('获取文章失败', error);
                this.articlesError = '加载文章失败，请稍后再试';
                this.articlesLoading = false;
            }
        },

        async fetchProfile() {
            try {
                this.profileLoading = true;
                const response = await userAPI.getProfile();
                this.profile = response.data;
                this.profileLoading = false;
            } catch (error) {
                console.error('获取个人资料失败：', error);
                this.profileError = '加载个人资料失败，请稍后再试';
                this.profileLoading = false;
            }
        },

        async updateProfile() {
            if (!this.$refs.profileForm.validate()) return;

            try {
                this.profileSaving = true;
                this.profileError = null;
                this.profileSuccess = null;

                await userAPI.updateProfile({
                    email: this.profile.email,
                    bio: this.profile.bio
                });

                this.profileSuccess = '个人资料已更新';
            } catch (error) {
                console.error('更新个人资料失败：', error);
                this.profileError = error.response?.data?.message || '更新个人资料失败，请稍后再试';
            } finally {
                this.profileSaving = false;
            }
        },

        confirmDelete(article) {
            this.articleToDelete = article;
            this.deleteDialog = true;
        },

        async deleteArticle() {
            if (!this.articleToDelete) return;

            try {
                this.deleteLoading = true;
                await articleAPI.delete(this.articleToDelete._id);

                // 从列表中移除已删除的文章
                this.articles = this.articles.filter(a => a._id !== this.articleToDelete._id);

                // 关闭对话框
                this.deleteDialog = false;
                this.articleToDelete = null;
            } catch (error) {
                console.error('删除文章失败', error);
                alert(error.response?.data?.message || '删除文章失败，请稍后再试');
            } finally {
                this.deleteLoading = false;
            }
        },

        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }
    }
}
</script>