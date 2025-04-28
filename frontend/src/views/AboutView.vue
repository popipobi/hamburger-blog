<!-- 关于我页面组件 -->
<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <h1 class="text-h3 mb-5 text-center">关于我</h1>
                <v-card class="pa-4">
                    <div class="d-flex flex-column align-center mb-6">
                        <v-avatar size="150" class="mb-4">
                            <v-img src="https://via.placeholder.com/150" alt="我的头像"></v-img>
                        </v-avatar>
                        <h2 class="text-h4">好吃汉堡包</h2>
                        <p class="text-subtitle-1 text-grey">写毫无营养代码的</p>
                    </div>

                    <v-divider class="my-4"></v-divider>

                    <h3 class="text-5 mv-3">技能</h3>
                    <v-row>
                        <v-col v-for="(skill, i) in skills" :key="i" cols="12" sm="6" md="4">
                            <v-card class="pa-2 text-center" variant="outlined">
                                {{ skill }}
                            </v-card>
                        </v-col>
                    </v-row>

                    <h3 class="text-h5 mb-3 mt-6">关于本博客</h3>
                    <p>
                        这是我的个人技术博客，主要分享我在日常学习过程中的收获与体会。有时可能也会写写日常的东西。
                    </p>

                    <h3 class="text-h5 mb-3 mt-6">联系方式</h3>
                    <div class="d-flex flex-wrap">
                        <v-btn prepend-icon="mdi-email" class="mr-2 mb-2" variant="outlined">
                            xxxxxxx@xxx.com
                        </v-btn>
                        <v-btn prepend-icon="mdi-github" class="mr-2 mb-2" variant="outlined">
                            GitHub
                        </v-btn>
                        <v-btn prepend-icon="mdi-linkedin" class="mr-2 mb-2" variant="outlined">
                            LinkedIn
                        </v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'AboutView',
    data() {
        return {
            skills: [
                '编程', '杂七杂八学习', '日常'
            ]
        }
    }
}
</script>