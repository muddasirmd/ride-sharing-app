import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import http from '@/helpers/http'
import Login from '@/views/LoginView.vue'
import LandingView from '@/views/LandingView.vue'
import LocationView from '@/views/LocationView.vue'
import MapView from '@/views/MapView.vue'
import TripView from '@/views/TripView.vue'
import StandByView from '@/views/StandByView.vue'
import DriverView from '@/views/DriverView.vue'

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
  },
  {
    path: '/trip',
    name: 'trip',
    component: TripView
  },
  {
    path: '/driver',
    name: 'driver',
    component: DriverView
  },
  {
    path: '/standby',
    name: 'standby',
    component: StandByView
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

  http().get('api/user', {
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
