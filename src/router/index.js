import Vue from 'vue'
import Router from 'vue-router'
import Information from '@/components/Information'
import Movies from '@/components/Movies'
import Series from '@/components/Series'

Vue.use(Router)

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
