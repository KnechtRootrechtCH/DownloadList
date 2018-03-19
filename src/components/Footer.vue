<template>
  <div>
    <footer class="footer">
      <div class="container">
        <span class="text-muted">© 2018 Copyright: </span>atheos.cc
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
html {
  position: relative;
  min-height: 100%;
}
body {
  margin-bottom: 60px; /* Margin bottom by footer height */
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px; /* Set the fixed height of the footer here */
  line-height: 60px; /* Vertically center the text there */
  background-color: #d5d5d5;
  color: #555
}

.container {
  width: auto;
  max-width: 680px;
  padding: 0 15px;
}
</style>
