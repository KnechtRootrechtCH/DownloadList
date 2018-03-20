<template>
  <div>
    <mediaSearch mediaType="tv" suggestionField="name" v-bind:inputPlaceholder="$t('series.inputPlaceholder')"/>
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
  },
  i18n: {
    messages: {
      de: {
        series:  {
          inputPlaceholder: 'Serie hinzufügen…',
        }
      },
      en: {
        series:  {
          inputPlaceholder: 'Add show…',
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
