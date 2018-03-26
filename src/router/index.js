import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import DownloadList from '@/components/DownloadList'
import Browse from '@/components/Browse'
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
      path: '/browse/search',
      name: 'Search',
      component: Browse,
      meta: {
        requiresAuth: true
      },
      props: {
        mode: 'search'
      }
    },
    {
      path: '/browse/movies',
      name: 'Movies',
      component: Browse,
      meta: {
        requiresAuth: true
      },
      props: {
        mode: 'movie'
      }
    },
    {
      path: '/browse/tv',
      name: 'Series',
      component: Browse,
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
      component: DownloadList,
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
