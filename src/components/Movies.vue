<template>
  <div>
    <mediaSearch mediaType="movie" suggestionField="title" v-bind:inputPlaceholder="$t('movies.inputPlaceholder')"/>
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
  },
  i18n: {
    messages: {
      de: {
        movies: {
          inputPlaceholder: 'Film hinzufügen…'
        }
      },
      en: {
        movies: {
          inputPlaceholder: 'Add movie…'
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
