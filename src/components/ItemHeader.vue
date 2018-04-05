<template>
  <div class="header" v-bind:style="{ backgroundImage: 'url(' + backdrop + ')' }">
    <div class="poster-section">
      <progressive-img class="poster" v-bind:src="poster" v-bind:fallback="posterPlaceholder" :blur="10"></progressive-img>
    </div>
    <div class="title-section">
        <h2 class="header-title d-none d-lg-inline">{{ title }}&nbsp;</h2>
        <h3 class="header-title d-none d-md-inline d-lg-none">{{ title }}&nbsp;</h3>
        <h5 class="header-title d-md-none">{{ title }}&nbsp;</h5>
        <span class="header-year">{{ releaseYear }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemHeader',
  props: ['item', 'details', 'mediaType'],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    title () {
      if (this.mediaType === 'movie') {
        return this.details.title
      } else if (this.mediaType === 'tv') {
        return this.details.name
      }
    },
    originalTitle () {
      if (this.mediaType === 'movie') {
        return this.details.original_title
      } else if (this.mediaType === 'tv') {
        return this.details.original_name
      }
    },
    release () {
      let date = null
      if (this.mediaType === 'movie') {
        date = this.details.release_date
      } else if (this.mediaType === 'tv') {
        date = this.details.first_air_date
      }
      if (date) {
        return this.$moment(date)
      }
      return null
    },
    releaseYear () {
      let date = this.release
      if (date) {
        return date.format('YYYY')
      }
    },
    poster () {
      // https://image.tmdb.org/t/p/w300_and_h450_bestv2/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg
      if (this.details.poster_path) {
        return 'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + this.details.poster_path
      } else {
        return ''
      }
    },
    posterPlaceholder () {
      // TODO: get correct placeholder (poster)
      return null
      /*
      if (this.mediaType === 'movie') {
        return this.$store.getters.fallbackMovieBackdrop
      } else if (this.mediaType === 'tv') {
        return this.$store.getters.fallbackTvBackdrop
      }
      */
    },
    backdrop () {
      // TODO: get correct placeholder (size)
      if (this.details.backdrop_path) {
        return 'https://image.tmdb.org/t/p/w1400_and_h450_face' + this.details.backdrop_path
      } else {
        return ''
      }
    },
    backdropPlaceholder () {
      if (this.mediaType === 'movie') {
        return this.$store.getters.fallbackMovieBackdrop
      } else if (this.mediaType === 'tv') {
        return this.$store.getters.fallbackTvBackdrop
      }
    }
  },
  methods: {
    open (url) {
      var win = window.open(url, '_blank')
      win.focus()
    }
  },
  i18n: {
    messages: {
      de: {
      },
      en: {
      }
    }
  }
}
</script>

<style scoped>
.header {
    width: 100%;
    height: 200px;
    background-size: cover;
    background-position: center;
    padding: 60px 0 0 0;
}
.poster-section {
  float: left;
  width: 180px;
}
.title-section {
  padding: 150px 0 0 0;
  overflow: hidden;
  white-space: nowrap;
}
.header-title {
  overflow: hidden;
  text-overflow: wrap;
  white-space: pre-wrap;
}
.header-year {
  opacity: 0.8;
}
.poster {
  width: 150px;
  height: 225px;
  margin: 0 15px 0 15px;
  border-color: #d0d0d0;
  border-style: solid;
}
</style>
