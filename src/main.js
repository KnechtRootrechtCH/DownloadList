// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueInstant from 'vue-instant'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueInstant)
Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

export const globalStore = new Vue({
  data: {
    // movieDbApiKey: '342d3061b70d2747a1e159ae9a7e9a36'
    movieDbApiKey: '23703a8a857927f41414fb155404393d',
    language: 'de'
  }
})

/*
VueInstant.methods.isSimilar = function (o) {
  if (o) {
    return o[this.suggestionAttribute].toLowerCase().StartsWith(this.textVal.toLowerCase())
  }
}
*/
