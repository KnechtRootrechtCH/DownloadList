<template>
  <div>
    <div class="content">
      <div v-for="episode in episodes" :key="episode.id" class="season">
        <div>
          <div class="poster-section">
          </div>
        </div>
        <div>
          <div class="label">{{ episode.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemEpisodeList',
  props: ['item', 'season'],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    episodes () {
      return null
    }
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
.label {
  font-weight: bold;
  /* text-transform: uppercase; */
}
.season {
  width: 100%;
  display: block;
  padding: 0;
}
.poster-section {
  width: 180px;
  float: left;
}
.poster {
  width: 150px;
  margin: 0 15px 15px 0;
  border-color: #d0d0d0;
  border-style: solid;
}
</style>
