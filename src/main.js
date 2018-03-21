// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import { store } from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'

import lodash from 'lodash'
import VueLodash from 'vue-lodash'

import BootstrapVue from 'bootstrap-vue'

import VueI18n from 'vue-I18n'
import vueLogger from 'vue-logger'

import App from './App'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueLodash, lodash)
Vue.use(BootstrapVue)
Vue.use(VueI18n)
Vue.use(vueLogger, {
  prefix: () => new Date(),
  dev: true,
  shortname: true,
  levels: ['log', 'warn', 'debug', 'error', 'dir']
})

const locale = navigator.language.trim().substring(0, 2)
const messages = {}
const i18n = new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages
})

let app

store.getters.getFirebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      store,
      i18n,
      axios,
      components: { App },
      template: '<App/>'
    })
  }
})

store.commit('setUser')
store.commit('setLocale')
