import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light'
    }
})

createApp(App)
    .use(store)
    .use(router)
    .use(vuetify)
    .mount('#app')
