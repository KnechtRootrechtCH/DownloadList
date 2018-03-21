import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import List from '@/components/List'
import Movies from '@/components/Movies'
import Series from '@/components/Series'
import Info from '@/components/Info'

import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/list'
    },
    {
      path: '/',
      redirect: '/list'
    },
    {
      path: '/authenticate',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/list',
      name: 'List',
      component: List,
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
    },
    {
      path: '/info',
      name: 'Info',
      component: Info,
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
