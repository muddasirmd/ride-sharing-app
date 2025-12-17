import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/LoginView.vue'
import LandingView from '@/views/LandingView.vue'
import axios from 'axios'
import LocationView from '@/views/LocationView.vue'
import MapView from '@/views/MapView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/landing',
    name: 'landing',
    component: LandingView
  },
  {
    path: '/location',
    name: 'location',
    component: LocationView
  },
  {
    path: '/map',
    name: 'map',
    component: MapView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


// Navigation guard | Middleware
router.beforeEach((to, from) => {
  
  if(to.name === 'login'){
    return true
  }

  if(!localStorage.getItem('token')){
    return {
      name: 'login'
    }
  }

  checkTokenAuthenticity()
})

const checkTokenAuthenticity = () => {
  axios.get('http://localhost/api/user', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then((response) => {})
  .catch((error) => {
    localStorage.removeItem('token')
    router.push({
      name: 'login'
    })
  })
}

export default router
