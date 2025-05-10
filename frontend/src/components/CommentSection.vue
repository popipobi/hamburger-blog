<!-- 评论组件 -->
<template>
  <div class="comment-section">
    <h2 class="text-h5 mb-4">评论 ({{ comments.length }})</h2>

    <!-- 评论表单 -->
    <v-card class="mb-6 pa-4" v-if="isLoggedIn">
      <v-form @submit.prevent="submitCommit" ref="commentForm">
        <v-textarea
          v-model="newComment.content"
          label="发表评论"
          outlined
          auto-grow
          :rules="[v => !!v || '评论内容不能为空', v => v.length<=1000 || '评论不能超过1000字符']"
          :counter="1000"
          :loading="submitting"
          :disabled="submitting"
        ></v-textarea>
        <div class="d-flex justify-end">
          <v-btn
            color="primary"
            type="submit"
            :loading="submitting"
            :disabled="submitting || !newComment.content"
          >
            发表评论
          </v-btn>
        </div>
      </v-form>
    </v-card>

    <v-alert v-else type="info" text>
      请 <router-link to="/login">登录</router-link> 后参与评论
    </v-alert>

    <!-- 回复表单 -->
    <v-card class="mb-6 pa-4" v-if="replyingTo">
      <div class="d-flex justify-space-between mb-2">
        <div class="text-sutitle-1">
          回复 <b>{{ replyingTo.author.username }}</b>
        </div>
        <v-btn icon small @click="cancelReply">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-form @submit.prevent="submitReply" ref="replyForm">
        <v-textarea
          v-model="newReply.content"
          outlined
          auto-grow
          :rules="[v => !!v || '回复内容不能为空', v => v.length<=1000 || '回复不能超过1000字符']"
          :counter="1000"
          :loading="submitting"
          :disabled="submitting"
          ></v-textarea>
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              type="submit"
              :loading="submitting"
              :disabled="submitting || !newReply.content"
            >
              发表回复
            </v-btn>
          </div>
      </v-form>
    </v-card>

    <!-- 评论列表 -->
    <div v-if="loading" class="text-center my-4">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <div v-else-if="error" class="text-center red--text my-4">
      {{ error }}
    </div>

    <div v-else-if="comments.length === 0" class="text-center grey--text my-4">
      啥评论也没有呢还...
    </div>

    <div v-else>
      <v-card v-for="comment in comments" :key="comment._id" class="mb-4">
        <!-- 主评论 -->
        <v-card-text>
          <div class="d-flex">
            <v-avatar size="36" class="mr-3">
              <v-img
                :src="comment.author.avatar || '/default-avatar.png'"
                alt="avatar"
              ></v-img>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="d-flex justify-space-between">
                <div class="text-subtitle-1 font-weight-bold">
                  {{ comment.author.username }}
                </div>
                <div class="text-caption grey--text">
                  {{ formatDate(comment.createdAt) }}
                </div>
              </div>
              <div class="comment-content my-2">
                {{ comment.content }}
              </div>
              <div class="d-flex">
                <v-btn text x-small color="primary" @click="replyTo(commit)" v-if="isLoggedIn">
                  <v-icon small class="mr-1">mdi-reply</v-icon>
                  回复
                </v-btn>
                <v-btn
                  text
                  x-small
                  color="red"
                  class="ml-2"
                  v-if="canModifyComment(comment)"
                  @click="deleteComment(comment._id)"
                >
                  删除  
                </v-btn>
                <v-btn
                  text
                  x-small
                  color="grey"
                  class="ml-2"
                  v-if="canModifyComment(comment) && !comment.editing"
                  @click="startEditing(comment)"
                >
                  <v-icon small class="mr-1">mdi-pencil</v-icon>
                  编辑
                </v-btn>
              </div>

              <!-- 编辑评论表单 -->
              <v-form v-if="comment.editing" @submit.prevent="updateComment(comment)" class="mt-2">
                <v-textarea
                  v-model="comment.editContent"
                  outlined
                  auto-grow
                  :rules="[v => !!v || '评论内容不能为空', v => v.length <= 1000 || '评论不能超过1000字符']"
                  :counter="1000"
                  dense
                  :loading="comment.updating"
                  :disabled="comment.updating"
                ></v-textarea>
                <div class="d-flex justify-end">
                  <v-btn text @click="cancelEditing(comment)" :disabled="comment.updating">
                    取消
                  </v-btn>
                  <v-btn
                    color="primary"
                    type="submit"
                    :loading="CustomElementRegistry.updating"
                    :disabled="comment.updating || !comment.editContent"
                  >
                    保存
                  </v-btn>
                </div>
              </v-form>
            </div>
          </div>
        </v-card-text>

        <!-- 回复列表 -->
        <div v-if="comment.replies && comment.replies.length > 0">
          <v-divider></v-divider>
          <div class="pa-4 pl-6 grey lighten-4">
            <div
              v-for="reply in comment.replies || []"
              :key="reply._id"
              class="mb-3 d-flex"
            >
              <v-avatar size="28" class="mr-3 mt-1">
                <v-img
                  :src="reply.author.avatar || '/default-avatar.png'"
                  alt="avatar"
                ></v-img>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between">
                  <div class="text-sutitle-2 font-weight-bold">
                    {{ reply.author.username }}
                  </div>
                  <div class="text-caption grey--text">
                    {{ formateDate(reply.createdAt) }}
                  </div>
                </div>
                <div class="comment-content my-1">
                  {{ reply.content }}
                </div>
                <div class="d-flex">
                  <v-btn text x-small color="primary" @click="replyTo(comment)" v-if="isLoggedIn">
                    <v-icon samll class="mr-1">mdi-reply</v-icon>
                    回复
                  </v-btn>
                  <v-btn
                    text
                    x-small
                    color="red"
                    class="ml-2"
                    v-if="canModifyComment(reply)"
                    @click="delteComment(reply._id)"
                  >
                    <v-icon small class="mr-1">mdi-delete</v-icon>
                    删除
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { commentAPI } from '@/services/api';

export default {
  name: 'CommentSection',
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      loading: true,
      error: null,
      submitting: false,
      newComment: {
        content: ''
      },
      newReply: {
        content: ''
      },
      replyingTo: null
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    currentUser() {
      return this.$store.state.user;
    }
  },
  created() {
    this.fetchComments();
  },
  methods: {
    async fetchComments() {
      try {
        this.loading = true;
        const response = await commentAPI.getByArticle(this.articleId);
        this.comments = response.data.map(comment => ({
          ...comment,
          editing: false,
          editContent: comment.content,
          updating: false
        }));
        this.loading = false;
      } catch (error) {
        console.error('加载评论失败', error);
        this.error = '加载评论失败，请稍后再试';
        this.loading = false;
      }
    },

    async submitComment() {
      if (this.$refs.commentForm.validate()) {
        try {
          this.submitting = true;
          const response = await commentAPI.create(this.articleId, this.newComment);

          // 添加到评论列表
          const newComment = {
            ...response.data,
            replies: [],
            editing: false,
            editContent: response.data.content,
            updating: false
          };
          this.comments.unshift(newComment);

          // 重置表单
          this.newComment.content = '';
          this.$refs.commentForm.resetValidation();
          this.submitting = false;
        } catch (error) {
          console.error('发表评论是失败，请稍后再试', error);
          this.$store.dispatch('setSnackbar', {
            show: true,
            text: '发表评论失败，请稍后再试',
            color: 'error'
          });
          this.submitting = false;
        }
      }
    },

    replyTo(comment) {
      this.replyingTo = commit;
      this.newReply.content = '',
      if (this.$refs.replyForm) {
        this.$refs.replyForm.resetValidation();
      }
      // 滚动到回复表单
      this.$nextTick(() => {
        const replyForm = document.querySelector('.comment-section .v-card:nth-child(2)');
        if (replyForm) {
          replyForm.scrollInfoView({ behavior: 'smooth' });
        }
      });
    },

    cancelReply() {
      this.replyingTo = null;
      this.newReply.content = '';
    },

    async submitReply() {
      if (this.$refs.replyForm.validate()) {
        try {
          this.submitting = true;
          const response = await commentAPI.create(
            this.articleId,
            {
              content: this.newReply.content,
              parentComment: this.replyingTo._id
            }
          );

          // 添加到回复列表
          const parentIndex = this.comments.findIndex(c => c.id === this.replyingTo._id);
          if (parentIndex !== -1) {
            if (!this.comments[parentIndex].replies) {
              this.$set(this.comments[parentIndex], 'replies', []);
            }
            this.comments[parentIndex].replies.push(response.data);
          }

          // 重置表单
          this.cancelReply();
          this.submitting = false;
        } catch (error) {
          console.error('发表回复失败', error);
          this.$store.dispatch('setSnackbar', {
            show: true,
            text: '发表回复失败，请稍后再试',
            color: 'error'
          });
          this.submitting = false;
        }
      }
    },

    canModifyComment(comment) {
      if (!this.isLoggedIn || !this.currentUser || !comment || !comment.author) return false;

      const userId = this.currentUser.id;
      const authorId = comment.author._id || comment.author.id;

      return userId === authorId || this.currentUser.role === 'admin';
    },

    async deleteComment(commentId) {
      if (!confirm('确定要删除此评论吗？')) return;

      try {
        await commentAPI.delete(commentId);

        // 找然后移除评论
        const commentIndex = this.comments.findIndex(c => c._id === commentId);
        if (commentIndex !== -1) {
          this.comments.splice(commentIndex, 1);
          return;
        }

        // 如果不是主评论，查找并移除回复
        for (let i=0; i<this.comments.length; i++) {
          if (this.comments[i].replies) {
            const replyIndex = this.comments[i].replies.findIndex(r => r._id === commentId);
            if (replyIndex !== -1) {
              this.comments[i].replies.splice(replyIndex, 1);
              break;
            }
          }
        }

        this.$store.dispatch('setSnackbar', {
          show: true,
          text: '评论已删除',
          color: 'success'
        });
      } catch (error) {
        console.error('删除评论失败', error);
        this.$store.dispatch('setSnackbar', {
          show: true,
          text: '删除评论失败，请稍候再试',
          color: 'error'
        });
      }
    },

    startEditing(comment) {
      comment.editing = true;
      comment.editContent = comment.content;
    },

    cancelEditing(comment) {
      comment.editing = false;
      comment.editContent = comment.content;
    },

    async updateComment(comment) {
      try {
        comment.updating = true;
        const response = await commentAPI.update(comment._id, { content: comment.editContent });

        // 更新评论内容
        comment.content = response.data.content;
        comment.editing = false;
        comment.updating = false;

        this.$store.dispatch('setSnackbar', {
          show: true,
          text: '评论已更新',
          color: 'success'
        });
      } catch (error) {
        console.error('更新评论失败', error);
        this.$store.dispatch('setSnackbar', {
          show: true,
          text: '更新评论失败，请稍候再试',
          color: 'error'
        });
        comment.updating = false;
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) {
        return '刚刚';
      } else if (diffMin < 60) {
        return `${diffMin}分钟前`;
      } else if (diffHour < 24) {
        return `${diffHour}小时前`;
      } else if (diffDay < 7) {
        return `${diffDay}天前`；
      } else {
        return date.toLocaleDateString();
      }
    }
  }
}
</script>

<style scoped>
.comment-content {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>