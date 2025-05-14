<!-- 页脚组件 -->
<template>
    <v-footer app padless class="mt-4">
        <v-container>
            <v-row justify="center" no-gutters>
                <v-col class="text-center">
                    <p>
                        © {{ new Date().getFullYear() }} - 半吊子技术博客 | 基于 Vue.js 和 Express.js 构建<br />
                        <a
                            href="https://beian.miit.gov.cn/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="color: inherit; text-decoration: none;"
                        >
                            辽ICP备2025055543号-1
                        </a>
                    </p>
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
