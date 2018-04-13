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
  computed: {
    movieDbConfig () {
      return this.$store.getters.movieDbConfiguration
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

.button-green {
  color: #339933;
  background: #f0f0f0;
}
.button-green.inverted {
  color:#f0f0f0;
  background: #339933;
}
.button-green:hover {
  color:#f0f0f0;
  background: #339933;
}
.button-blue {
  color: #444499;
  background: #f0f0f0;
}
.button-blue.inverted {
  color:#f0f0f0;
  background: #444499;
}
.button-blue:hover {
  color:#f0f0f0;
  background: #444499;
}
.button-red {
  color: #CC3333;
  background: #f0f0f0;
}
.button-red.inverted {
  color:#f0f0f0;
  background: #CC3333;
}
.button-red:hover {
  color:#f0f0f0;
  background: #CC3333;
}
.button-purple {
  color: #CC22BB;
  background: #f0f0f0;
}
.button-purple.inverted {
  color:#f0f0f0;
  background: #CC22BB;
}
.button-purple:hover {
  color:#f0f0f0;
  background: #CC22BB;
}
.button-darkgrey {
  color: #495057;
  background: #f0f0f0;
}
.button-darkgrey.inverted {
  color:#f0f0f0;
  background: #495057;
}
.button-darkgrey:hover {
  color:#f0f0f0;
  background: #495057;
}
.button-grey {
  color: #666666;
  background: #f0f0f0;
}
.button-grey.inverted {
  color:#f0f0f0;
  background: #666666;
}
.button-grey:hover {
  color:#f0f0f0;
  background: #666666;
}
.button-netflix-red {
  color: #B9090B;
  background: #f0f0f0;
}
.button-netflix-red.inverted {
  color:#f0f0f0;
  background: #B9090B;
}
.button-netflix-red:hover {
  color:#f0f0f0;
  background: #B9090B;
}
.button-gold {
  color: #dd9c25;
  background: #f0f0f0;
}
.button-gold.inverted {
  color:#f0f0f0;
  background: #dd9c25;
}
.button-gold:hover {
  color:#f0f0f0;
  background: #dd9c25;
}
</style>
