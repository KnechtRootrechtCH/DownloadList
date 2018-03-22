// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import firebase from './firebase'
import i18n from './i18n'
import logger from './logger'
import { store } from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'
import lodash from 'lodash'
import VueLodash from 'vue-lodash'
import BootstrapVue from 'bootstrap-vue'
import VueProgressiveImage from 'vue-progressive-image'
import { VueMasonryPlugin } from 'vue-masonry'

import App from './App'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueLodash, lodash)
Vue.use(BootstrapVue)
Vue.use(VueProgressiveImage)
Vue.use(VueMasonryPlugin)

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
      lodash,
      i18n,
      axios,
      components: { App },
      template: '<App/>'
    })
  }
})
