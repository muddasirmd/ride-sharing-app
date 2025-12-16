import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import VueGoogleMaps from '@fawmi/vue-google-maps'


createApp(App)
.use(router)
.use(createPinia())
.use(VueGoogleMaps, {
    load: {
        key: 'YOUR_GOOGLE_MAPS_API_KEY',
        libraries: 'places',
    },
})
.mount('#app')
