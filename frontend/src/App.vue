<!-- 主组件 -->
<template>
    <v-app>
        <app-header></app-header>

        <v-main class="py-6 mt-14 mb-16">
            <router-view></router-view>
        </v-main>

        <app-footer></app-footer>
    </v-app>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

export default {
    name: 'App',
    components: {
        AppHeader,
        AppFooter
    }
}
</script>

<style>
body {
    font-family: 'Roboto', sans-serif;
}
</style>