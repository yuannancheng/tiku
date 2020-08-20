import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
import Exercise from '@/pages/exercise/Exercise'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/exercise/:id',
    name: 'Exercise',
    component: Exercise
  }],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
