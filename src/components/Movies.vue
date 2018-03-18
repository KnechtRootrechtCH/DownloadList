<template>
  <div>
    <div class="dlst-input">
      <input type="text" v-model="msg" placeholder="Search movie.."/>
    </div>

    <div>
      {{msg}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Movies',
  data () {
    return {
      msg: ''
    }
  }
}
</script>

<style scoped>

</style>
