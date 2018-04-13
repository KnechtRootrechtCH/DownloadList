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
        :icon="icon('check')"
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
import UtilsMixin from '../../mixins/utils'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'ItemHeader',
  props: ['item', 'details', 'mediaType'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    title () {
      return this.getTitle(this.details)
    },
    originalTitle () {
      return this.getOriginalTitle(this.details)
    },
    releaseYear () {
      return this.getReleaseDateFormated('YYYY')
    },
    poster () {
      return this.getPosterImage(this.details, this.constants.IMAGESIZE.POSTER.W185)
    },
    posterPlaceholder () {
      return this.getPosterPlaceholder(this.constants.IMAGESIZE.POSTER.W185)
    },
    backdrop () {
      return this.getBackdropImage(this.details, this.constants.IMAGESIZE.BACKDROP.W1400)
    },
    backdropPlaceholder () {
      return this.getBackdropPlaceholder(this.constants.IMAGESIZE.BACKDROP.W1400)
    },
    downloaded () {
      if (this.item) {
        return this.item.downloaded
      }
      return false
    }
  },
  methods: {
    open (url) {
      let win = window.open(url, '_blank')
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
