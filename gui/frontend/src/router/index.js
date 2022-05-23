import Vue from 'vue'
import VueRouter from 'vue-router'
import {COMP_GARD} from './config/routerConfig'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard')
  },
  {
    path: '/component/:compid',
    name: 'Component', 
    component: () => import('../views/Component'), 
    props: true, 
    beforeEnter: COMP_GARD
  }
]

const router = new VueRouter({
  routes
})

export default router
