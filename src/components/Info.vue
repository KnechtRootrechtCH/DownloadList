<template>
  <div class="info">
    <!--<img class="app_logo" src="../assets/logo.png"/>-->
    <h2>Author</h2>
    <ul>
      <li><a href="https://github.com/KnechtRootrechtCH" target="_blank">KnechtRootrechtCH</a></li>
    </ul>
    <h2>Project Information</h2>
    <ul>
      <li><a href="https://github.com/KnechtRootrechtCH/DownloadList" target="_blank">git hub project page</a></li>
    </ul>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">core docs</a></li>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">template</a></li>
      <br>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="https://bootstrap-vue.js.org/docs/" target="_blank">bootstrap-vue</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://fontawesome.com/icons" target="_blank">fontawesome</a></li>
    </ul>
    <h2>References</h2>
      <ul>
        <li><a href="https://developers.themoviedb.org/3" target="_blank">firebase</a></li>
        <li><a href="https://developers.themoviedb.org/3" target="_blank">the movie database</a></li>
        <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
      </ul>
  </div>
</template>

<script>
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
