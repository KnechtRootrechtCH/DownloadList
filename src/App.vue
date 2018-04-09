<template>
  <div id="app">
    <navigation/>
    <div class="app-content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

import Navigation from './components/Navigation'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-instant/dist/vue-instant.css'

export default {
  name: 'App',
  components: {
    'navigation': Navigation
  },
  data () {
    return {
      movies: [],
      shows: []
    }
  },
  created: function () {
    this.$store.dispatch('getFirebaseData')
    this.$store.dispatch('getMovieDbConfiguration')
    let currentUser = firebase.auth().currentUser
    if (currentUser) {
      this.$store.dispatch('getFirebaseUserData')
    }
  }
}
</script>

<style>
body {
  /*background: #2c3e50 !important;*/
  background: #17212b !important;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ddd;
}
.app-content {
  padding-top:58px;
}
a {
  color: #ffbf58;
}
a:hover {
  color: #ffbf58;
}
</style>
