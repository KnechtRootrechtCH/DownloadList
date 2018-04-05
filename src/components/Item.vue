<template>
  <div class="item">
    <div v-if="details">
      <div id="content">
        <div id= "header" class="header-section">
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
        </div>
        <b-container fluid>
          <b-row>
            <b-col cols="12" md="6" xl="8" id="overview" class="content-section">
              <!--<h5>{{ $t('item.overview') }}</h5>-->
              <div>{{ details.overview}}</div>
            </b-col>
            <b-col cols="12" md="6" xl="4" id="actions" class="content-section">
              <!--<h5>{{ $t('item.actions') }}</h5>-->
              <b-list-group>
                <action
                  v-if="downloaded"
                  v-bind:label="$t('item.action.downloaded')"
                  v-bind:isClickable="false"
                  v-bind:isActive="true"
                  v-bind:colorVariant="green"
                  icon="downloaded"></action>
                <priority
                  v-if="selected && !downloaded"
                  v-bind:label="$t('item.action.priority')"
                  v-bind:colorVariant="purple"
                  v-bind:itemKey="key"
                  v-bind:current="item.priority"
                  min="3"
                  icon="star"
                  @click.native="setDownloaded(false)"></priority>
                <action
                  v-if="!selected"
                  v-bind:label="$t('item.action.select')"
                  v-bind:isClickable="true"
                  v-bind:colorVariant="blue"
                  icon="add"
                  @click.native="setSelected(true)"></action>
                <action
                  v-if="selected && !downloaded"
                  v-bind:label="$t('item.action.markDownloaded')"
                  v-bind:isClickable="true"
                  v-bind:colorVariant="green"
                  icon="downloaded"
                  @click.native="setDownloaded(true)"></action>
                <action
                  v-if="selected && downloaded"
                  v-bind:label="$t('item.action.redownload')"
                  v-bind:isClickable="true"
                  v-bind:colorVariant="purple"
                  icon="redownload"
                  @click.native="setDownloaded(false)"></action>
                <action
                  v-if="selected && !downloaded"
                  v-bind:label="$t('item.action.deselect')"
                  v-bind:isClickable="true"
                  v-bind:colorVariant="red"
                  icon="remove"
                  @click.native="setSelected(false)"></action>
              </b-list-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" class="content-section">
              <h5>{{ $t('item.info') }}</h5>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="6" xl="8" id="overview" class="content-section">
              Cast Info...
            </b-col>
            <b-col cols="12" md="6" xl="4" id="actions" class="content-section">
              <b-list-group>
                <action
                  v-if="details.homepage"
                  v-bind:label="$t('item.links.homepage')"
                  v-bind:isClickable="true"
                  v-bind:isActive="false"
                  v-bind:colorVariant="blue"
                  icon="globe"
                  @click.native="open(details.homepage)"></action>
                <action
                  v-if="movieDbUrl"
                  v-bind:label="$t('item.links.moviedb')"
                  v-bind:isClickable="true"
                  v-bind:isActive="false"
                  v-bind:colorVariant="blue"
                  v-bind:icon="mediaType"
                  @click.native="open(movieDbUrl)"></action>
              </b-list-group>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
    <div v-if="!details">
      <!-- TODO: handle load fail -->
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

import infoIcon from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import addIcon from '@fortawesome/fontawesome-free-solid/faPlusCircle'
import removeIcon from '@fortawesome/fontawesome-free-solid/faMinusCircle'
import priorityIcon from '@fortawesome/fontawesome-free-solid/faStar'
import redownloadIcon from '@fortawesome/fontawesome-free-solid/faRedoAlt'
import downloadedIcon from '@fortawesome/fontawesome-free-solid/faCheckCircle'
import editIcon from '@fortawesome/fontawesome-free-solid/faEdit'

import ItemAction from './ItemAction'
import ItemPriority from './ItemPriority'

export default {
  name: 'Item',
  props: ['id', 'mediaType'],
  data () {
    return {
      lowestPriority: 3,
      defaultPriority: 2,
      hoverPriority: 10,
      green: '#339933',
      blue: '#444499',
      red: '#CC3333',
      purple: '#CC22BB'
    }
  },
  components: {
    FontAwesomeIcon,
    'action': ItemAction,
    'priority': ItemPriority
  },
  computed: {
    key () {
      return this.mediaType + ':' + this.id
    },
    details () {
      let details = this.$store.getters.suggestionDetails
      return details
    },
    item () {
      // this.$store.getters.item(this.item.key)
      var item = this.$store.getters.item(this.key)
      return item
    },
    title () {
      if (this.mediaType === 'movie') {
        return this.details.title
      } else if (this.mediaType === 'tv') {
        return this.details.name
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
      if (!date) {
        return this.$i18n.t('item.' + this.mediaType + '.dateNotFound')
      }

      return date.format('YYYY')
    },
    releaseDate () {
      let date = this.release
      if (!date) {
        return this.$i18n.t('item.' + this.mediaType + '.dateNotFound')
      }

      return date.format('DD.MM.YYYY')
    },
    rating () {
      return this.details.vote_average
    },
    priority () {
      if (this.item) {
        return this.item.priority
      } else {
        return 0
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
    },
    movieDbUrl () {
      this.destroyTooltips()
      return 'https://www.themoviedb.org/' + this.mediaType + '/' + this.id
    },
    selected () {
      return this.item
    },
    downloaded () {
      if (this.item) {
        return this.item.downloaded
      }
      return false
    },
    addIcon () {
      return addIcon
    },
    downloadedIcon () {
      return downloadedIcon
    },
    removeIcon () {
      return removeIcon
    },
    infoIcon () {
      return infoIcon
    },
    priorityIcon () {
      return priorityIcon
    },
    editIcon () {
      return editIcon
    },
    redownloadIcon () {
      return redownloadIcon
    }
  },
  methods: {
    open (url) {
      var win = window.open(url, '_blank')
      win.focus()
    },
    setSelected (select) {
      this.destroyTooltips()
      console.log('setSelected', select)

      if (!select) {
        this.$store.dispatch('removeItem', this.item.key)
      } else {
        console.log('add', this.details)
        this.details.priority = this.defaultPriority
        this.details.media_type = this.mediaType
        this.details.key = this.mediaType + ':' + this.details.id
        this.$store.dispatch('addItem', this.details)
      }
    },
    setDownloaded (downloaded) {
      this.destroyTooltips()

      if (this.item) {
        this.$store.dispatch('setItemDownloaded', {
          key: this.item.key,
          downloaded: downloaded})
      }
    },
    hoverPriorityIcon (priority) {
      return priority >= this.hoverPriority
    },
    destroyTooltips () {
      // quite a hack, but works
      let tooltips = document.getElementsByClassName('tooltip')
      for (let i = tooltips.length - 1; i >= 0; i--) {
        // Remove first element (at [0]) repeatedly
        tooltips[0].parentNode.removeChild(tooltips[0])
      }
    }
  },
  created () {
    this.$store.dispatch('getSuggestionDetails', {
      'media_type': this.mediaType,
      'id': this.id
    })
  },
  i18n: {
    messages: {
      de: {
        item: {
          actions: 'Aktionen',
          action: {
            downloaded: 'Heruntergeladen',
            select: 'Der Liste hinzufügen',
            deselect: 'Aus Liste entfernen',
            markDownloaded: 'Als heruntergeladen markieren',
            redownload: 'Erneut herunterladen',
            priority: 'Download Priorität'
          },
          overview: 'Handlung',
          info: 'Details',
          links: {
            moviedb: 'The Movie Db',
            homepage: 'Homepage'
          }
        }
      },
      en: {
        item: {
          actions: 'Actions',
          action: {
            downloaded: 'Downloaded',
            select: 'Add to downloadlist',
            deselect: 'Remove from downloadlist',
            markDownloaded: 'Mark as downloaded',
            redownload: 'Redownload',
            priority: 'Download priority'
          },
          overview: 'Overview',
          info: 'Details',
          links: {
            moviedb: 'The Movie Db',
            homepage: 'Homepage'
          }
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
    padding: 60px 0 0 0;
}
.header-section {
  height: 300px;
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
.content-section {
  padding: 15px;
}
.action-list-item .action-label {
  float: right;
}
</style>
