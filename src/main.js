// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import { store } from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'
import firebase from 'firebase'

import lodash from 'lodash'
import VueLodash from 'vue-lodash'

import BootstrapVue from 'bootstrap-vue'

import VueI18n from 'vue-I18n'
import vueLogger from 'vue-logger'

import App from './App'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(firebase)
Vue.use(VueLodash, lodash)
Vue.use(BootstrapVue)
Vue.use(VueI18n)
Vue.use(vueLogger, {
  prefix: () => new Date(),
  dev: true,
  shortname: true,
  levels: ['log', 'warn', 'debug', 'error', 'dir']
})

let app
let config = {
  apiKey: 'AIzaSyAiT0HW9uJ-enr4DvXMIiF8MY0RftBsDUg',
  authDoman: 'downloadlist-7465c.firebaseapp.com',
  databaseURL: 'https://downloadlist-7465c.firebaeio.com',
  projectId: 'dwnloadlist-7465c',
  storageBuckt: 'downloadlist-765c.appspot.com',
  messagingSenderd: '364654976505'
}

const locale = navigator.language.trim().substring(0, 2)
store.state.language = locale
const messages = {}
const i18n = new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages
})
export default i18n

firebase.initializeApp(config)
firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      store,
      i18n,
      components: { App },
      template: '<App/>'
    })
  }
})
