<!-- 登录页面组件 -->
<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card class="pa-4">
                    <h1 class="text-h4 mb-4 text-center">登录</h1>

                    <v-alert
                        v-if="error"
                        type="error"
                        class="mb-4"
                        closable
                        @click:close="error = null"
                    >
                        {{ error }}
                    </v-alert>

                    <v-form @submit.prevent="handleLogin" ref="form">
                        <v-text-field
                            v-model="username"
                            label="用户名"
                            prepend-icon="mdi-account"
                            :rules="[v => !!v || '用户名不能为空']"
                            required
                            class="equal-width-field"
                        ></v-text-field>

                        <v-text-field
                            v-model="password"
                            label="密码"
                            prepend-icon="mdi-lock"
                            :type="showPassword ? 'text':'password'"
                            :append-icon="showPassword ? 'mdi-eye':'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"
                            :rules="[v => !!v || '密码不能为空']"
                            required
                        ></v-text-field>

                        <div class="d-flex justify-end mb-4">
                            <v-checkbox v-model="rememberMe" label="记住我"></v-checkbox>
                        </div>

                        <v-btn
                            type="submit"
                            color="primary"
                            block
                            :loading="loading"
                        >
                            登录
                        </v-btn>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { userAPI } from '@/services/api';

export default {
    name: 'LoginView',
    data() {
        return {
            username: '',
            password: '',
            rememberMe: false,
            showPassword: false,
            loading: false,
            error: null
        }
    },
    methods: {
        async handleLogin() {
            if (!this.$refs.form.validate()) return;

            this.loading = true;
            this.error = null;

            try {
                const response = await userAPI.login({
                    username: this.username,
                    password: this.password
                });

                const { token, user } = response.data;
                this.$store.commit('login', { token, user });

                if (this.rememberMe) {
                    // 如果选择"记住我"，可以设置更长的过期时间。这里只是前端提示，实际令牌有效期由后端控制
                    console.log('记住登录状态');
                }

                this.$router.push('/admin');
            } catch (error) {
                console.error('登录出错：', error);
                this.error = error.response?.data?.message || '登录失败，请稍后再试';
            } finally {
                this.loading = false;
            }
            // // 暂时使用虚拟数据登录
            // setTimeout(() => {
            //     if (this.username === 'admin' && this.password === 'admin') {
            //     // 登录成功
            //     this.$store.commit('login', {
            //         token: 'mock-token-123',
            //         user: {
            //         id: 1,
            //         username: 'admin',
            //         role: 'admin'
            //         }
            //     })
            //     this.$router.push('/admin')
            //     } else {
            //     // 登录失败
            //     this.error = '用户名或密码错误'
            //     }
            //     this.loading = false
            // }, 1000);

            // 实际API调用将会是这样
            // axios.post('http://localhost:3000/api/auth/login', {
            //     username: this.username,
            //     password: this.password
            // })
            //     .then(response => {
            //         const { token, user } = response.data
            //         this.$store.commit('login', { token, user })
            //         this.$router.push('/admin')
            //     })
            //     .catch(error => {
            //         this.error = error.response?.data?.message || '登录失败，请稍后再试'
            //         console.error(error)
            //     })
            //     .finally(() => {
            //         this.loading = false
            // })
        }
    }
}
</script>

<style>
.equal-width-field {
    width: calc(100% - 40px);
}
</style>