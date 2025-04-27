<!-- 头部导航组件 -->
<template>
    <v-app-bar app color="primary" dark>
        <v-app-bar-title>
            <router-link to="/" class="text-decoration-none text-white">半吊子技术博客</router-link>
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn to="/" text class="mr-2">首页</v-btn>
        <v-btn to="/about" text class="mr-2">关于我</v-btn>

        <template v-if="!isLoggedIn">
            <v-btn to="/login" text class="mr-2">登录</v-btn>
            <v-btn to="/register" text class="mr-2">注册</v-btn>
        </template>
        <template v-else>
            <v-btn to="/admin" text class="mr-2">管理</v-btn>
            <v-btn text @click="logout" class="mr-2">退出</v-btn>
        </template>
    </v-app-bar>
</template>

<script>
export default {
    name: 'AppHeader',
    computed: {
        isLoggedIn() {
            return this.$store.state.isLoggedIn
        }
    },
    methods: {
        logout() {
            this.$store.commit('logout')
            this.$router.push('/')
        }
    }
}
</script>