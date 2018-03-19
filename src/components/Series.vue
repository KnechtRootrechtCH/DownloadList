<template>
  <div>
    <mediaSearch mediaType="tv" suggestionField="name" inputPlaceholder="Serie hinzufügen…"/>
  </div>
</template>

<script>
import MediaSearch from './MediaSearch'

export default {
  name: 'Series',
  components: {
    'mediaSearch': MediaSearch
  },
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
