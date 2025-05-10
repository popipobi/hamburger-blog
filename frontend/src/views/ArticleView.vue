<template>
  <v-container>
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-else-if="error" class="text-center red--text">
      {{ error }}
    </div>
    <div v-else>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div class="text-h3 mb-2">{{ article.title }}</div>
          <div class="text-subtitle-1 mb-4 text-grey">
            发布于 {{ formatDate(article.createdAt) }}
            <span v-if="article.author">
              | 作者：{{ article.author.username }}
            </span>
          </div>
          <v-img
            v-if="article.coverImage"
            :src="getImageUrl(article.coverImage)"
            class="mb-5"
            max-height="400"
            contain
          ></v-img>
          <div class="article-content" v-html="articleContent"></div>

          <v-divider class="my-6"></v-divider>
          <div v-if="article.tags && article.tags.length > 0" class="mb-4">
            <h3 class="text-h6 mb-2">标签</h3>
            <v-chip
              v-for="tag in article.tags"
              :key="tag"
              class="mr-2 mb-2"
              color="primary"
              text-color="white"
              >
                {{ tag }}
            </v-chip>
          </div>

          <div class="d-flex justify-space-between mt-6">
            <v-btn text @click="$router.push('/')">
            <v-icon left>mdi-arrow-left</v-icon>
            返回首页
          </v-btn>
          <v-btn
            v-if="isAuthor"
            color="primary"
            :to="`/admin/article/edit/${article._id}`"
          >
            <v-icon left>mdi-pencil</v-icon>
            编辑文章
          </v-btn>
          </div>

          <!-- 添加评论部分 -->
          <v-divider class="my-6"></v-divider>
          <comment-section
            v-if="article._id"
            :article-id="article._id"
          ></comment-section>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { articleAPI } from '@/services/api'
import CommentSection from '@/componets/CommentSection.vue'

// 配置marked使用highlight.js高亮代码
marked.setOptions({
  highlight: function(code, lang) {
    return hljs.highlightAuto(code).value
  }
});

export default {
  name: 'ArticleView',
  components: {
    CommentSection
  },
  data() {
    return {
      article: {},
      loading: true,
      error: null
    }
  },
  computed: {
    articleContent() {
      return this.article.content ? marked(this.article.content) : ''
    },
    isAuthor() {
      if (!this.$store.state.isLoggedIn || !this.article.author) return false;

      const userId = this.$store.state.user?.id;
      const authorId = this.article.author._id || this.article.author.id;

      return userId === authorId ||
        this.$store.state.user?.role === 'admin';
    }
  },
  created() {
    this.fetchArticle();
  },
  methods: {
    async fetchArticle() {
      const articleId = this.$route.params.id;
      try {
        this.loading = true;
        const response = await articleAPI.getById(articleId);
        this.article = response.data;
        this.loading = false;
      } catch (error) {
        console.error('加载文章失败', error);
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
      return `http://localhost:3000${path}`;
    }
  }
}
</script>

<style>
.article-content {
  line-height: 1.8;
}
.article-content h1,
.article-content h2,
.article-content h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}
.article-content pre {
  background-color: #f8f8f8;
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
}
.article-content img {
  max-width: 100%;
  display: block;
  margin: 1em auto;
}
</style>