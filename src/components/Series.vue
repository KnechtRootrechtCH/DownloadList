<template>
  <div class="suggestion-list">
    <suggestion-list v-bind:mediaType="mediaType" v-bind:header="$t('tv.header')" v-bind:inputPlaceholder="$t('tv.inputPlaceholder')"></suggestion-list>
  </div>
</template>

<script>
import SuggestionList from './SuggestionList'

export default {
  name: 'Series',
  data () {
    return {
      mediaType: 'tv'
    }
  },
  components: {
    'suggestionList': SuggestionList
  },
  i18n: {
    messages: {
      de: {
        tv: {
          header: 'Serien',
          inputPlaceholder: 'Serie suchen…'
        }
      },
      en: {
        tv: {
          header: 'Series',
          inputPlaceholder: 'Search series…'
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
