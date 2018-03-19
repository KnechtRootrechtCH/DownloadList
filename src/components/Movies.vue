<template>
  <div>
    <mediaSearch mediaType="movie" suggestionField="title" inputPlaceholder="Film hinzufügen…"/>
  </div>
</template>

<script>
import MediaSearch from './MediaSearch'

export default {
  name: 'Movies',
  components: {
    'mediaSearch': MediaSearch
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>

</style>
