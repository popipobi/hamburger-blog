<template>
    <v-container>
        <h1 class="text-h3 mb-5">{{ isEditing ? '编辑文章' : '创建文章' }}</h1>

        <v-form @submit.prevent="saveArticle" ref="form">
            <v-card class="pa-4 mb-4">
                <v-text-field
                    v-model="article.title"
                    label="文章标题"
                    :rules="[v => !!v || '标题不能为空']"
                    required
                ></v-text-field>

                <v-textarea
                    v-model="article.summary"
                    label="文章摘要"
                    rows="3"
                    :rules="[v => !!v || '摘要不能为空']"
                    required
                ></v-textarea>

                <v-file-input
                    label="封面图片"
                    accept="image/*"
                    prepend-icon="mdi-camera"
                    v-model="selectedFile"
                    :clearable="true"
                ></v-file-input>

                <v-img
                    v-if="article.coverImage"
                    :src="getImageUrl(article.coverImage)"
                    max-height="200"
                    contain
                    class="mt-2 mb-4"
                ></v-img>

                <v-combobox
                    v-model="article.tags"
                    label="标签"
                    multiple
                    chips
                    small-chips
                    hint="输入标签后按回车添加"
                    persistent-hint
                ></v-combobox>
            </v-card>

            <v-card class="pa-4 mb-4">
                <h2 class="text-h5 mb-3">文章内容</h2>
                <p class="text-caption mb-2">支持Markdown格式</p>

                <v-textarea
                    v-model="article.content"
                    label="内容"
                    rows="15"
                    :rules="[v => !!v || '内容不能为空']"
                    required
                    outlined
                    hide-details
                ></v-textarea>
            </v-card>

            <div class="d-flex justify-space-between mt-4">
                <v-btn
                    text
                    :to="isEditing ? `/article/${articleId}` : '/admin'"
                >
                    取消
                </v-btn>
                <v-btn
                    type="submit"
                    color="primary"
                    :loading="loading"
                >
                    保存文章
                </v-btn>
            </div>
        </v-form>
    </v-container>
</template>

<script>
import { articleAPI, uploadAPI } from '@/services/api';

export default {
    name: 'ArticleEditView',
    data() {
        return {
            articleId: this.$route.params.id,
            isEditing: !!this.$route.params.id,
            article: {
                title: '',
                content: '',
                summary: '',
                coverImage: '',
                tags: []
            },
            selectedFile: null,
            loading: false,
        }
    },
    created() {
        // 如果是编辑模式，加载文章数据
        if (this.isEditing) {
            this.fetchArticle();
        }
    },
    methods: {
        async fetchArticle() {
            try {
                this.loading = true;
                const response = await articleAPI.getById(this.articleId);
                const article = response.data;

                this.article = {
                    title: article.title,
                    content: article.content,
                    summary: article.summary,
                    coverImage: article.coverImage,
                    tags: article.tags || []
                };

                this.loading = false;
            } catch (error) {
                console.error('获取文章失败：', error);
                this.$store.dispatch('setSnackbar', {
                    show: true,
                    text: '加载文章失败，请稍候再试',
                    color: 'error'
                });
                this.loading = false;
            }
        },

        async uploadImage() {
            if (!this.selectedFile) {
                console.log('没有选择文件，跳过上传');
                return null;
            }

            try {
                console.log('准备上传图片：', this.selectedFile.name);

                const formData = new FormData();
                formData.append('image', this.selectedFile);

                // 确保图片被正确添加到FormData
                console.log('FormData创建成功，准备发送请求');

                const response = await uploadAPI.uploadImage(formData);
                console.log('上传成功，响应：', response.data);

                return response.data.filePath;
            } catch (error) {
                console.error('上传图片失败详情：', error.response ? error.response.data : error.message);
                this.$store.dispatch('setSnackbar', {
                    show: true,
                    text: '上传图片失败：' + (error.response?.data?.message || error.message),
                    color: 'error'
                });
                throw new Error('上传图片失败');
            }
        },

        async saveArticle() {
            if (!this.$refs.form.validate()) return;

            this.loading = true;

            try {
                // 如果有选择新图片，先上传图片
                if (this.selectedFile) {
                    const imagePath = await this.uploadImage();
                    if (imagePath) {
                        this.article.coverImage = imagePath;
                    }
                }

                // 保存文章
                if (this.isEditing) {
                    // 更新已有文章
                    await articleAPI.update(this.articleId, this.article);
                    this.$store.dispatch('setSnackbar', {
                        show: true,
                        text: '文章已更新',
                        color: 'success'
                    });
                } else {
                    const response = await articleAPI.create(this.article);
                    this.$store.dispatch('setSnackbar', {
                        show: true,
                        text: '文章已创建',
                        color: 'success'
                    });

                    // 创建成功后跳转到文章页面
                    setTimeout(() => {
                        this.$router.push(`/article/${response.data._id}`);
                    }, 1500);
                }
            } catch (error) {
                console.error('保存文章失败：', error);
                this.$store.dispatch('setSnackbar', {
                    show: true,
                    text: error.response?.data?.message || '文章保存失败，请稍候再试',
                    color: 'error'
                });
            } finally {
                this.loading = false;
            }
        },

        getImageUrl(path) {
            if (path.startsWith('http')) {
                return path;
            }

            const baseUrl = process.env.NODE_ENV === 'production'
                ? ''
                : 'http://localhost:3000'
            return `${baseUrl}${path}`;
        }
    }
}
</script>