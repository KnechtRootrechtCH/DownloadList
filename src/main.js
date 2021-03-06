// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import firebase from './firebase'
import i18n from './i18n'
import logger from './logger'
import { store } from './store'

import underscore from 'vue-underscore'
import linkify from 'vue-linkify'
import BootstrapVue from 'bootstrap-vue'
import VueProgressiveImage from 'vue-progressive-image'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLocalStorage from 'vue-localstorage'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'swiper/dist/css/swiper.css'

import App from './App'

Vue.config.productionTip = false

Vue.use(underscore)
Vue.use(BootstrapVue)
Vue.use(VueProgressiveImage)
Vue.use(VueMomentJS, moment)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLocalStorage)

library.add(faCoffee)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.directive('linkified', linkify)

let app

store.dispatch('getFirebaseSettings')
store.dispatch('getMovieDbConfiguration')

firebase.authentication.onAuthStateChanged(function (user) {
  store.commit('setUser')
  store.commit('setLocale')
  if (user) {
    store.dispatch('getFirebaseUserData')
  }

  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      store,
      logger,
      i18n,
      components: { App },
      template: '<App/>'
    })
  }
})
