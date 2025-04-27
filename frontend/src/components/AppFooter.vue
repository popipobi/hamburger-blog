<!-- 页脚组件 -->
<template>
    <v-footer app padless class="mt-4">
        <v-container>
            <v-row justify="center" no-gutters>
                <v-col class="text-center">
                    <p>© {{ new Date().getFullYear() }} - 半吊子技术博客 | 基于 Vue.js 和 Express.js 构建</p>
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
</template>

<script>
export default {
    name: 'AppFooter'
}
</script>