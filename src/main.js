// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import router from './router'
import axios from 'axios'
import firebase from 'firebase'

import BootstrapVue from 'bootstrap-vue'
import VueAxios from 'vue-axios'
import VueInstant from '../static/vue-instant/dist/vue-instant.common.js'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-instant/dist/vue-instant.css'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueInstant)
Vue.use(BootstrapVue)
Vue.use(firebase)
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

firebase.initializeApp(config)
firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})

export const globalStore = new Vue({
  data: {
    movieDbApiKey: '23703a8a857927f41414fb155404393d',
    language: 'de'
  }
})

/*
Components: https://github.com/vuejs/awesome-vue
SAYT: https://github.com/santiblanko/vue-instant
Promises: https://www.npmjs.com/package/vue-axios
*/
