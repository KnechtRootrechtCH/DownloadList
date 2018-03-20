<template>
  <div id="app">
    <navigation/>
    <div class="app-content">
      <router-view/>
    </div>
    <dlst-footer/>
  </div>
</template>

<script>
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-instant/dist/vue-instant.css'

export default {
  name: 'App',
  components: {
    'navigation': Navigation,
    'dlst-footer': Footer
  }
}
</script>

<style>
body {
  background: #2c3e50;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ddd;
}
.app-content a {
  color: #ffbf58;
}
.app-content a:hover {
  color: #ffbf58;
}
.app-content .btn-yellow {
  background-color: #ffbf58;
  border-color: #ffbf58;
}
</style>
