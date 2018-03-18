<template>
    <div>
      <input type="text" v-model="msg" placeholder="Search movie.."/>
    </div>
</template>

<script>
export default {
  name: 'MovieSearch',
  data () {
    return {
      msg: ''
    }
  }
}
</script>

<style scoped>
</style>
