<template>
  <div>

  </div>
</template>

<script>
import ItemEpisode from './Episode'

export default {
  name: 'ItemEpisodeList',
  props: ['id', 'item', 'episodes'],
  data () {
    return {
    }
  },
  components: {
    'episode': ItemEpisode
  },
  computed: {
  },
  methods: {
    poster (season) {
      if (season.poster_path) {
        return 'https://image.tmdb.org/t/p/w185' + season.poster_path
      } else {
        return ''
      }
    }
  },
  i18n: {
    messages: {
      de: {
        item: {
          episodes: 'Episoden'
        }
      },
      en: {
        item: {
          episodes: 'Episodes'
        }
      }
    }
  }
}
</script>

<style scoped>
*:focus {
    outline: none;
}
</style>
