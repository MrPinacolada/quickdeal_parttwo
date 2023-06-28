import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'
const app = createApp(App)
app.use(ViewUIPlus)
app.use(createPinia())
app.use(router)
app.mount('#app')
