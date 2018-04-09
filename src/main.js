// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import firebase from './firebase'
import i18n from './i18n'
import logger from './logger'
import { store } from './store'

import underscore from 'vue-underscore'
import BootstrapVue from 'bootstrap-vue'
import VueProgressiveImage from 'vue-progressive-image'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import 'swiper/dist/css/swiper.css'

import App from './App'

Vue.config.productionTip = false

Vue.use(underscore)
Vue.use(BootstrapVue)
Vue.use(VueProgressiveImage)
Vue.use(VueMomentJS, moment)
Vue.use(VueAwesomeSwiper)

let app

firebase.authentication.onAuthStateChanged(function (user) {
  store.commit('setUser')
  store.commit('setLocale')

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
