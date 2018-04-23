<template>
  <b-container fluid class="episodes-container">
    <b-row>
      <episode v-for="episode in season.episodes" :key="episode.id" v-bind:id="episode.id" v-bind:item="item" v-bind:episode="episode"></episode>
    </b-row>
  </b-container>
</template>

<script>
import Episode from './Episode'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'EpisodeList',
  props: ['item', 'season'],
  mixins: [IconsMixin],
  data () {
    return {
      expanded: false
    }
  },
  components: {
    'episode': Episode
  },
  computed: {
  },
  methods: {
  },
  i18n: {
    messages: {
      de: {
        item: {
          season: {
          }
        }
      },
      en: {
        item: {
          season: {
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.episodes-container {
  padding: 0;
}
</style>
