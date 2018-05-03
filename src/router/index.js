import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import List from '@/components/List'
import Discover from '@/components/Discover'
import Item from '@/components/Item'
import Season from '@/components/Season'
import Profile from '@/components/Profile'
import About from '@/components/About'

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
      path: '/browse/movie',
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
      path: '/browse/tv',
      name: 'Series',
      component: Discover,
      meta: {
        requiresAuth: true
      },
      props: {
        default: true,
        mode: 'tv'
      }
    },
    {
      path: '/browse/:mediaType/:id',
      name: 'ItemDetails',
      component: Item,
      meta: {
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/browse/tv/:id/season/:seasonNumber',
      name: 'SeasonDetails',
      component: Season,
      meta: {
        requiresAuth: true
      },
      props: true
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
      path: '/list/:mediaType/:id',
      name: 'ListItem',
      component: Item,
      meta: {
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/list/tv/:id/season/:seasonNumber',
      name: 'ListSeasonDetails',
      component: Season,
      meta: {
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
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
