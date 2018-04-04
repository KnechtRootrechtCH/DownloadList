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
        <div id="overview" class="content-section">
          <h5>{{ $t('item.overview') }}</h5>
          <div>{{ details.overview}}</div>
        </div>
        <div id="info" class="content-section">
          <h5>{{ $t('item.links') }}</h5>
          <div>Homepage:&nbsp;<a target="_blank" v-bind:href="details.homepage">{{ details.homepage }}</a></div>
          <div>MovieDb:&nbsp;<a target="_blank" v-bind:href="movieDbUrl">{{ movieDbUrl }}</a></div>

          <!--
          <h5>{{ $t('item.description') }}</h5>
          <div>{{details.description}}</div>
          -->
        </div>
        <!--
        <div id="edit" class="content-section" v-if="selected">
          <h5>{{ $t('item.edit') }}</h5>

        </div>
        <div id="seasons" class="content-section" v-if="mediaType === 'tv'">
          <h5>{{ $t('item.seasons') }}</h5>

        </div>
        -->
      </div>
    </div>
    <div v-if="!details">
      item not found ({{ key }})
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

import highPriorityIcon from '@fortawesome/fontawesome-free-solid/faArrowAltCircleUp'
import mediumPriorityIcon from '@fortawesome/fontawesome-free-solid/faCircle'
import lowPriorityIcon from '@fortawesome/fontawesome-free-solid/faArrowAltCircleDown'

export default {
  name: 'Item',
  props: ['id', 'mediaType'],
  data () {
    return {
      lowestPriority: 3,
      defaultPriority: 2,
      hoverPriority: 10,
      editMode: false
    }
  },
  components: {
    FontAwesomeIcon
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
    highPriorityIcon () {
      return highPriorityIcon
    },
    mediumPriorityIcon () {
      return mediumPriorityIcon
    },
    lowPriorityIcon () {
      return lowPriorityIcon
    },
    redownloadIcon () {
      return redownloadIcon
    }
  },
  methods: {
    getMovieDbUrl () {
      var url = 'https://www.themoviedb.org/' + this.mediaType + '/' + this.item.id
      return url
    },
    hasPriority (priority) {
      var selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        return selectedItem.priority <= priority
      }
      return false
    },
    setPriority (priority) {
      this.destroyTooltips()
      this.editMode = false

      var selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        this.$store.dispatch('setItemPriority', {
          key: selectedItem.key,
          priority: priority})
      } else {
        this.item.priority = priority
        this.$store.dispatch('addItem', this.item)
      }
    },
    setDownloaded (downloaded) {
      this.destroyTooltips()
      this.editMode = false

      var selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        this.$store.dispatch('setItemDownloaded', {
          key: selectedItem.key,
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
          overview: 'Handlung',
          links: 'Links'
        }
      },
      en: {
        item: {
          overview: 'Overview',
          links: 'Links'
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
</style>
