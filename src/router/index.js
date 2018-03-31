import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import List from '@/components/List'
import Discover from '@/components/Discover'
import Movie from '@/components/Movie'
import Info from '@/components/Info'

import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/browse/discover'
    },
    {
      path: '/',
      redirect: '/browse/discover'
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
      path: '/browse/discover',
      name: 'Discover',
      component: Discover,
      meta: {
        requiresAuth: true
      },
      props: {
        mode: 'discover'
      }
    },
    {
      path: '/browse/movies',
      name: 'Movies',
      component: Discover,
      meta: {
        requiresAuth: true
      },
      props: {
        mode: 'movie'
      }
    },
    {
      path: '/browse/movies/:itemId',
      name: 'Movie',
      component: Movie,
      meta: {
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/browse/tv',
      name: 'Series',
      component: Discover,
      meta: {
        requiresAuth: true
      },
      props: {
        mode: 'tv'
      }
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
    next('/authenticate')
  } else {
    window.scrollTo(0, 0)
    next()
  }
})

export default router
