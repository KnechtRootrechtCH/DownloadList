import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Info from '@/components/Information'
import Movies from '@/components/Movies'
import Series from '@/components/Series'

import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/info'
    },
    {
      path: '/',
      redirect: '/info'
    },
    {
      path: '/authenticate',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: Signup
    },
    {
      path: '/info',
      name: 'Info',
      component: Info,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/movies',
      name: 'Movies',
      component: Movies,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/series',
      name: 'Series',
      component: Series,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    next('authenticate')
  } else {
    next()
  }
})

export default router
