<template>
  <div class="header" v-bind:style="{ backgroundImage: 'url(' + backdrop + ')' }">
    <div class="poster-section">
      <progressive-img class="poster-small d-md-none" v-bind:src="poster" v-bind:fallback="posterPlaceholder" :blur="10"></progressive-img>
      <progressive-img class="poster-big d-none d-md-block" v-bind:src="poster" v-bind:fallback="posterPlaceholder" :blur="10"></progressive-img>
    </div>
    <div class="icons-section">
      <div class="header-icons">
        <font-awesome-icon
        v-b-tooltip
        v-if="downloaded"
        :icon="downloadedIcon"
        class="icon"
        v-bind:title="$t('item.downloaded')"/>
      </div>
    </div>
    <div class="title-section">
        <h2 class="header-title d-none d-lg-inline">{{ title }}&nbsp;</h2>
        <h3 class="header-title d-none d-md-inline d-lg-none">{{ title }}&nbsp;</h3>
        <h5 class="header-title d-md-none">{{ title }}&nbsp;</h5>
        <span class="header-year">{{ releaseYear }}</span>
        <div class="header-tagline d-none d-md-block" v-if="details.tagline">{{ details.tagline}}</div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import downloadedIcon from '@fortawesome/fontawesome-free-solid/faCheckCircle'

export default {
  name: 'ItemHeader',
  props: ['item', 'details', 'mediaType'],
  data () {
    return {
    }
  },
  components: {
    FontAwesomeIcon
  },
  computed: {
    downloadedIcon () {
      return downloadedIcon
    },
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
        return 'https://image.tmdb.org/t/p/w185' + this.details.poster_path
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
    },
    downloaded () {
      if (this.item) {
        return this.item.downloaded
      }
      return false
    },
    isAvailableOnNetflix () {
      return this.details.homepage.includes('www.netflix.com/')
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
        item: {
          downloaded: 'Erfolgreich heruntergeladen'
        }
      },
      en: {
        item: {
          downloaded: 'Successfully downloaded'
        }
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
    padding: 30px 0 0 0;
}
.poster-section {
  float: left;
}
.icons-section {
  padding: 130px 15px 0 0;
  height: 180px;
}
.title-section {
  overflow: hidden;
  white-space: nowrap;
}
.header-icons {
  float: right;
}
.header-title {
  overflow: hidden;
  text-overflow: wrap;
  white-space: pre-wrap;
}
.header-tagline {
  font-style: italic;
}
.header-year {
  opacity: 0.8;
}
.poster-small {
  width: 150px;
  margin: 20px 15px 0 15px;
  border-color: #d0d0d0;
  border-style: solid;
}
.poster-big {
  width: 180px;
  margin: 0 15px 0 15px;
  border-color: #d0d0d0;
  border-style: solid;
}
.icon {
  width: 28px;
  height: 28px;
  color: lime;
}
</style>
