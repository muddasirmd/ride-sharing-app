import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueGoogleMaps from '@fawmi/vue-google-maps'


createApp(App)
.use(router)
.use(VueGoogleMaps, {
    load: {
        key: 'YOUR_GOOGLE_MAPS_API_KEY',
    },
})
.mount('#app')
