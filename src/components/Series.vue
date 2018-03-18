<template>
  <div>
    <div class="dlst-input">
      <input type="text" v-model="msg" placeholder="Search tv series.."/>
    </div>

    <div>
      {{msg}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Series',
  data () {
    return {
      msg: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
