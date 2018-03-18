<template>
  <div>
    <movieSearch/>
  </div>
</template>

<script>
import MovieSearch from './controls/MovieSearch'

export default {
  name: 'Movies',
  components: {
    'movieSearch': MovieSearch
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>

</style>
