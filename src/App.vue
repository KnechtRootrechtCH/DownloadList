<template>
  <div id="app">
    <navigation/>
    <router-view/>
    <dlst-footer/>
  </div>
</template>

<script>
import Navigation from './components/Navigation'
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    'navigation': Navigation,
    'dlst-footer': Footer
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ddd;
}
body {
  background: #2c3e50;
}
a {
  color: #ffbf58;
}
a:hover {
  color: #ffbf58;
}
.btn-yellow {
  background-color: #ffbf58;
  border-color: #ffbf58;
}
</style>
