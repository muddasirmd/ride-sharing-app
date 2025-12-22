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
        key: 'AIzaSyCiBZXM5dDNMiJ9uEm7iIk40fUcykkPdvI',
        libraries: 'places',
    },
})
.mount('#app')
