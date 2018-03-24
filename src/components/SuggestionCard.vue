<template>
  <div class="card border-dark suggestion-card" v-bind:class="{ 'suggestion-card-active': !isDownloaded(id), 'bg-light text-dark': isSelected(id), 'bg-dark text-light': !isSelected(id) }" v-on:click.stop="toggleItem(index, id)">
    <div class="card-image-top">
      <progressive-img v-bind:src="getBackdrop(backdrop)" v-bind:fallback="backdropPlaceholder" :blur="2"></progressive-img>
    </div>
    <div class="card-body">
      <div class="card-title col-xs-6">{{ title }}</div>
      <div class="card-release col-xs-2">{{ getReleaseDate(releaseDate) }}</div>
      <div class="card-icons container-fluid">
        <div class="row justify-content-between">
          <div class='col-xs-6'>
           <font-awesome-icon v-b-tooltip :icon="infoIcon" class="card-icon" @click.stop="openInformationUrl(id)" v-bind:title="$t('suggestionCard.tooltip.info')"/>
          </div>
          <div class='col-xs-6'>
            <font-awesome-icon v-b-tooltip v-if="!isDownloaded(id)" :icon="priorityIcon" class="card-icon" v-bind:class="{ 'priority-icon-inactive': !hasPriority(id, 3) }" @click.stop="setPriority(index, id, 3)" v-bind:title="$t('suggestionCard.tooltip.priority3')"/>
            <font-awesome-icon v-b-tooltip v-if="!isDownloaded(id)" :icon="priorityIcon" class="card-icon" v-bind:class="{ 'priority-icon-inactive': !hasPriority(id, 2) }" @click.stop="setPriority(index, id, 2)" v-bind:title="$t('suggestionCard.tooltip.priority2')"/>
            <font-awesome-icon v-b-tooltip v-if="!isDownloaded(id)" :icon="priorityIcon" class="card-icon" v-bind:class="{ 'priority-icon-inactive': !hasPriority(id, 1) }" @click.stop="setPriority(index, id, 1)" v-bind:title="$t('suggestionCard.tooltip.priority1')"/>
            <font-awesome-icon v-b-tooltip v-if="isDownloaded(id)" :icon="downloadedIcon" class="card-icon check-icon" v-bind:title="$t('suggestionCard.tooltip.downloaded')"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

import infoIcon from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import addIcon from '@fortawesome/fontawesome-free-solid/faPlusCircle'
import removeIcon from '@fortawesome/fontawesome-free-solid/faTimesCircle'
import priorityIcon from '@fortawesome/fontawesome-free-solid/faDownload'
import downloadedIcon from '@fortawesome/fontawesome-free-solid/faCheckCircle'

export default {
  name: 'SuggestionItem',
  props: ['suggestionType', 'index', 'id', 'title', 'releaseDate', 'backdrop'],
  data () {
    return {
      lowestPriority: 3
    }
  },
  components: {
    FontAwesomeIcon
  },
  computed: {
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
    backdropPlaceholder () {
      if (this.suggestionType === 'movie') {
        return this.$store.getters.fallbackMovieBackdrop
      } else if (this.suggestionType === 'tv') {
        return this.$store.getters.fallbackTvBackdrop
      }
    }
  },
  methods: {
    openInformationUrl (id) {
      this.destroyTooltips()
      var url = this.getInfoUrl(id)
      var win = window.open(url, '_blank')
      win.focus()
    },
    getBackdrop (path) {
      if (path) {
        return 'https://image.tmdb.org/t/p/w500' + path
      } else {
        return ''
      }
    },
    getInfoUrl (id) {
      if (id) {
        return 'https://www.themoviedb.org/' + this.suggestionType + '/' + id
      } else {
        return 'https://www.themoviedb.org/' + this.suggestionType + '/'
      }
    },
    getReleaseDate (date) {
      if (!date) {
        return this.$i18n.t('suggestionCard.' + this.suggestionType + '.dateNotFound')
      }
      let moment = this.$moment(date)
      let formated = moment.format('YYYY')
      if (formated) {
        return formated
      } else {
        return this.$i18n.t('suggestionCard.' + this.suggestionType + '.dateNotFound')
      }
    },
    toggleItem (index, id, event) {
      this.destroyTooltips()

      if (this.suggestionType === 'movie') {
        this.toggleMovie(index, id)
      } else if (this.suggestionType === 'tv') {
        this.toggleTv(index, id)
      }
    },
    toggleMovie (index, id) {
      var item = this.getItem(id)
      if (item) {
        if (item.downloaded) {
          return
        }
        this.$store.dispatch('removeMovie', item.id)
      } else {
        item = this.$store.getters.movieSuggestions[index]
        item.priority = this.lowestPriority
        this.$store.dispatch('addMovie', item)
      }
    },
    toggleTv (index, id) {
      var item = this.getItem(id)
      if (item) {
        if (item.downloaded) {
          return
        }
        this.$store.dispatch('removeTv', item.id)
      } else {
        item = this.$store.getters.tvSuggestions[index]
        item.priority = this.lowestPriority
        this.$store.dispatch('addTv', item)
      }
    },
    getItem (id) {
      if (this.suggestionType === 'movie') {
        return this.$store.getters.movie(id)
      } else if (this.suggestionType === 'tv') {
        return this.$store.getters.tv(id)
      }
    },
    isSelected (id) {
      var item = this.getItem(id)
      return item
    },
    isDownloaded (id) {
      var item = this.getItem(id)
      if (item) {
        return item.downloaded
      }
      return false
    },
    hasPriority (id, priority) {
      var item = this.getItem(id)
      if (item) {
        return item.priority <= priority
      }
      return false
    },
    setPriority (index, id, priority, event) {
      this.destroyTooltips()

      var item = this.getItem(id)
      if (item) {
        if (item.priority === priority) {
          priority++
        }
        if (priority > this.lowestPriority) {
          this.toggleItem(index, id)
        } else if (this.suggestionType === 'movie') {
          this.$store.dispatch('setMoviePriority', {
            id: item.id,
            priority: priority})
        } else if (this.suggestionType === 'tv') {
          this.$store.dispatch('setTvPriority', {
            id: item.id,
            priority: priority})
        }
      } else {
        item = this.$store.getters.movieSuggestions[index]
        item.priority = priority
        if (this.suggestionType === 'movie') {
          this.$store.dispatch('addMovie', item)
        } else if (this.suggestionType === 'tv') {
          this.$store.dispatch('addTv', item)
        }
      }
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
  i18n: {
    messages: {
      de: {
        suggestionCard: {
          tooltip: {
            info: 'Zusätzliche Informationen von "TheMovieDB.org"',
            downloaded: 'Bereits heruntergeladen',
            remove: 'Aus Downloadliste entfernen',
            priority3: 'Tiefe Priorität',
            priority2: 'Mittlere Priorität',
            priority1: 'Hohe Priorität',
            add: 'Diesen Titel der Downloadliste hinzufügen'
          },
          movie: {
            dateNotFound: '-'
          },
          tv: {
            dateNotFound: '-'
          }
        }
      },
      en: {
        suggestionCard: {
          tooltip: {
            info: 'Additional information from "TheMovieDB.org"',
            downloaded: 'Downloaded',
            remove: 'Remove from download list',
            priority3: 'Low priority',
            priority2: 'Medium priority',
            priority1: 'High priority',
            add: 'Add to download list'
          },
          movie: {
            dateNotFound: '-'
          },
          tv: {
            dateNotFound: '-'
          }
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

.suggestion-card {
  margin: 0 15px 15px 0;
  transition: transform .5s;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.suggestion-card:hover {
  z-index: 100;
  transform: scale(1.05);
}
.suggestion-card-selected {
  border-color: darkkhaki;
}
.suggestion-card-active {
  cursor: pointer;
}
.card-image-top {
  background-color: #343a40;
}
.card-body {
  padding: 10px;
}
.card-title {
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;
}
.card-release {
  margin-bottom: 4px;
}
.card-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.check-icon {
  color: darkgreen;
}
.priority-icon-inactive {
  opacity: 0.5;
}
.priority-icon-active {
    opacity: 0.8;
    color: black;
}
.card-img-overlay {
  z-index: 10;
  padding: 15px;
}
</style>
