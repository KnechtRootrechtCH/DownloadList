<template>
  <div id="app">
    <loading/>
    <navigation/>
    <div class="app-content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Navigation from './components/Navigation'
import LoadingOverlay from './components/Loading'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-instant/dist/vue-instant.css'

export default {
  name: 'App',
  components: {
    'navigation': Navigation,
    'loading': LoadingOverlay
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
  padding-top:56px;
}
.app-content a {
  color: #ffbf58;
}
.app-content a:hover {
  color: #ffbf58;
}
.app-content .button-green {
  color: #339933;
  background: #f0f0f0;
}
.app-content .button-green.inverted {
  color:#f0f0f0;
  background: #339933;
}
.app-content .button-green:hover {
  color:#f0f0f0;
  background: #339933;
}
.app-content .button-blue {
  color: #444499;
  background: #f0f0f0;
}
.app-content .button-blue.inverted {
  color:#f0f0f0;
  background: #444499;
}
.app-content .button-blue:hover {
  color:#f0f0f0;
  background: #444499;
}
.app-content .button-red {
  color: #CC3333;
  background: #f0f0f0;
}
.app-content .button-red.inverted {
  color:#f0f0f0;
  background: #CC3333;
}
.app-content .button-red:hover {
  color:#f0f0f0;
  background: #CC3333;
}
.app-content .button-purple {
  color: #CC22BB;
  background: #f0f0f0;
}
.app-content .button-purple.inverted {
  color:#f0f0f0;
  background: #CC22BB;
}
.app-content .button-purple:hover {
  color:#f0f0f0;
  background: #CC22BB;
}
.app-content .button-darkgrey {
  color: #495057;
  background: #f0f0f0;
}
.app-content .button-darkgrey.inverted {
  color:#f0f0f0;
  background: #495057;
}
.app-content .button-darkgrey:hover {
  color:#f0f0f0;
  background: #495057;
}
.app-content .button-grey {
  color: #666666;
  background: #f0f0f0;
}
.app-content .button-grey.inverted {
  color:#f0f0f0;
  background: #666666;
}
.app-content .button-grey:hover {
  color:#f0f0f0;
  background: #666666;
}
.app-content .button-netflix-red {
  color: #B9090B;
  background: #f0f0f0;
}
.app-content .button-netflix-red.inverted {
  color:#f0f0f0;
  background: #B9090B;
}
.app-content .button-netflix-red:hover {
  color:#f0f0f0;
  background: #B9090B;
}
.app-content .button-gold {
  color: #dd9c25;
  background: #f0f0f0;
}
.app-content .button-gold.inverted {
  color:#f0f0f0;
  background: #dd9c25;
}
.app-content .button-gold:hover {
  color:#f0f0f0;
  background: #dd9c25;
}
</style>
