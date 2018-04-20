<template>
  <b-list-group-item variant="dark">
    <div class="poster-section">
        <progressive-img class="still" v-bind:src="still" :blur="10"></progressive-img>
      </div>
    {{ episode.episode_number}}.&nbsp;{{ episode.name }}&nbsp;({{ airDate }})
  </b-list-group-item>
</template>

<script>
export default {
  name: 'ItemEpisode',
  props: ['id', 'item', 'episode'],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    airDate () {
      if (this.episode.air_date) {
        let moment = this.$moment(this.episode.air_date)
        let formated = moment.format('DD.MM.YYYY')
        return formated
      } else {
        return ''
      }
    },
    still () {
      if (this.episode.still_path) {
        return 'https://image.tmdb.org/t/p/w185' + this.episode.still_path
      } else {
        return ''
      }
    }
  },
  methods: {
  },
  i18n: {
    messages: {
      de: {
        item: {
        }
      },
      en: {
        item: {
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
.still {
  width: 150px;
  float: left;
  padding: 0;
  margin: 0;
}
</style>
