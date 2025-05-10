<!-- 主组件 -->
<template>
    <v-app>
        <app-header></app-header>

        <v-main class="py-6 mt-14 mb-16">
            <router-view></router-view>
        </v-main>

        <app-footer></app-footer>

        <!-- 全局 Snackbar -->
        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :timeout="3000"
            top
        >
            {{ snackbar.text }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    text
                    v-bind="attrs"
                    @click="closeSnackbar"
                >
                    关闭
                </v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { mapState } from 'vuex'

export default {
    name: 'App',
    components: {
        AppHeader,
        AppFooter
    },
    computed: {
        ...mapState(['snackbar'])
    },
    methods: {
        closeSnackbar() {
            this.$store.dispatch('setSnackbar', { show: false, text: '' })
        }
    }
}
</script>

<style>
body {
    font-family: 'Roboto', sans-serif;
}
</style>