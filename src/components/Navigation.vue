<template>
  <div>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
      <router-link class="navbar-brand" to="/">
        <img src="../assets/jdl.png" width="30" height="30" class="d-inline-block align-top" alt="">
        Download List
      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarNav" aria-expanded="false" aria-label="Navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <div class="navbar-nav">
          <router-link class="nav-item nav-link" to="/movies">Movies</router-link>
          <router-link class="nav-item nav-link" to="/series">Series</router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navigation'
}
</script>

<style scoped>
</style>
