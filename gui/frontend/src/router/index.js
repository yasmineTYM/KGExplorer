import Vue from 'vue'
import VueRouter from 'vue-router'
import {mapState} from 'vuex'

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
    // beforeEnter (to, from, next) {
    //   // ...
    //   console.log("to ... ") 
    //   console.log(to)
    // }
  }
]

const router = new VueRouter({
  routes
})

export default router
