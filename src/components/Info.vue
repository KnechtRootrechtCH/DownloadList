<template>
  <div class="info">
    <!--<img class="app_logo" src="../assets/logo.png"/>-->
    <h2>Project Information</h2>
    <ul>
      <li><a href="https://github.com/KnechtRootrechtCH/DownloadList" target="_blank">Git Hub Project Page</a></li>
    </ul>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <h2>References</h2>
      <ul>
        <li><a href="https://bootstrap-vue.js.org/docs/" target="_blank">Bootstrap Vue</a></li>
        <li><a href="https://developers.themoviedb.org/3" target="_blank">The Movie Database API</a></li>
        <li><a href="https://fontawesome.com/icons" target="_blank">Font Awesome</a></li>
      </ul>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Information',
  data () {
    return {
    }
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.info {
    text-align: center;
    margin: 10px 30px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
img.app_logo {
  height: 300px;
}
</style>
