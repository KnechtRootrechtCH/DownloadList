import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueInstant from 'vue-instant'

import Information from '@/components/Information'
import Movies from '@/components/Movies'
import Series from '@/components/Series'

import 'vue-instant/dist/vue-instant.css'

Vue.use(Router)
Vue.use(VueAxios, axios)
Vue.use(VueInstant)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Information',
      component: Information
    },
    {
      path: '/movies',
      name: 'Movies',
      component: Movies
    },
    {
      path: '/series',
      name: 'Series',
      component: Series
    }
  ]
})
