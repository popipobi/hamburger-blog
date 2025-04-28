<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" lg="4">
                <v-card class="pa-4">
                    <h1 class="text-h4 mb-4 text-center">注册</h1>

                    <v-alert
                        v-if="error"
                        type="error"
                        class="mb-4"
                        closable
                        @click:close="error = null"
                    >
                        {{ error  }}
                    </v-alert>

                    <v-form @submit.prevent="handleRegister" ref="form">
                        <v-text-field
                            v-model="username"
                            label="用户名"
                            prepend-icon="mdi-account"
                            :rules="[v => !!v || '用户名不能为空']"
                            required
                            class="equal-width-field"
                        ></v-text-field>

                        <v-text-field
                            v-model="email"
                            label="邮箱"
                            prepend-icon="mdi-email"
                            :rules="[
                                v => !!v || '邮箱不能为空',
                                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '请输入有效的邮箱地址'
                            ]"
                            required
                            class="equal-width-field"
                        ></v-text-field>

                        <v-text-field
                            v-model="password"
                            label="密码"
                            prepend-icon="mdi-lock"
                            :type="showPassword ? 'text' : 'password'"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"
                            :rules="[
                                v => !!v || '密码不能为空',
                                v => v.length >= 6 || '密码长度至少为6个字符'
                            ]"
                        ></v-text-field>

                        <v-text-field
                            v-model="confirmPassword"
                            label="确认密码"
                            prepend-icon="mdi-lock-check"
                            :type="showPassword ? 'text' : 'password'"
                            :rules="[
                                v => !!v || '请确认密码',
                                v => v === password || '两次输入的密码不一致'
                            ]"
                            required
                            class="equal-width-field"
                        ></v-text-field>

                        <v-btn
                            type="submit"
                            color="primary"
                            block
                            :loading="loading"
                            class="mt-4"
                        >
                            注册
                        </v-btn>

                        <div class="text-center mt-4">
                            已有账号？
                            <router-link to="/login">去登录</router-link>
                        </div>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { userAPI } from '@/services/api';

export default {
    name: 'RegisterView',
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            showPassword: false,
            loading: false,
            error: null
        }
    },
    methods: {
        async handleRegister() {
            if (!this.$refs.form.validate()) return;

            this.loading = true;
            this.error = null;

            try {
                const response = await userAPI.register({
                    username: this.username,
                    email: this.email,
                    password: this.password
                });

                const { token, user } = response.data;
                this.$store.commit('login', { token, user });

                // 注册成功后跳转到管理页面
                this.$router.push('/admin');
            } catch (error) {
                console.error('注册失败', error);
                this.error = error.response?.data?.message || '注册失败，请稍后再试';
            } finally {
                this.loading = false;
            }
        }
    }
}

</script>

<style>
.equal-width-field {
    width: calc(100% - 40px);
}
</style>