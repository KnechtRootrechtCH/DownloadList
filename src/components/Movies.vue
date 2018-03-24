<template>
  <div class="suggestion-list">
    <suggestion-list v-bind:mediaType="mediaType" v-bind:header="$t('movies.header')" v-bind:inputPlaceholder="$t('movies.inputPlaceholder')"></suggestion-list>
  </div>
</template>

<script>
import SuggestionList from './SuggestionList'

export default {
  name: 'Movies',
  data () {
    return {
      mediaType: 'movie'
    }
  },
  components: {
    'suggestionList': SuggestionList
  },
  i18n: {
    messages: {
      de: {
        movies: {
          header: 'Filme',
          inputPlaceholder: 'Film suchen…'
        }
      },
      en: {
        movies: {
          header: 'Movies',
          inputPlaceholder: 'Search movie…'
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
