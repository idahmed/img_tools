import '@fontsource/syne/600.css'
import '@fontsource/syne/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/style.css'

registerSW({ immediate: true })
createApp(App).use(router).mount('#app')
