<template>
  <div class="list">
    <h2>{{ $t("list.header") }}</h2>
    <div v-if="!items" class="download-item-info-section">
        {{ $t("list.noItems") }}
    </div>
    <div class="menu-bar">
      <b-button-group>
        <b-button class="menu-bar-button" variant="light" v-bind:class="{'btn-dark inactive' : !filter.movie}" @click="filter.movie = !filter.movie">
          <font-awesome-icon :icon="tvIcon" class="button-icon"/>
          {{ $t('list.filter.movie') }}
        </b-button>
        <b-button class="menu-bar-button" variant="light" v-bind:class="{'btn-dark inactive' : !filter.tv}" @click="filter.tv = !filter.tv">
          <font-awesome-icon :icon="movieIcon" class="button-icon"/>
          {{ $t('list.filter.tv') }}
        </b-button>
        <b-button class="menu-bar-button" variant="light" v-bind:class="{'btn-dark inactive' : !filter.downloaded}" @click="filter.downloaded = !filter.downloaded">
          <font-awesome-icon :icon="downloadedIcon" class="button-icon"/>
          {{ $t('list.filter.downloaded') }}
        </b-button>
      </b-button-group>

      <b-dropdown v-bind:text="sortButtonText" :icon="movieIcon" class="m-md-2 menu-bar-button " variant="light">
        <b-dropdown-item-button v-on:click="changeSortMethod('title')">{{ $t("list.sort.title") }}</b-dropdown-item-button>
        <b-dropdown-item-button v-on:click="changeSortMethod('priority')">{{ $t("list.sort.priority") }}</b-dropdown-item-button>
        <b-dropdown-item-button v-on:click="changeSortMethod('release')">{{ $t("list.sort.release") }}</b-dropdown-item-button>
      </b-dropdown>
    </div>
    <transition-group name="download-list" tag="p" class="container-fluid download-container">
        <div class="download-item row" v-for="(item) in sortedItems" :key="item.key">
          <div class="col-sm-2 hidden-md-down download-item-media">
            <progressive-img class="download-item-poster" v-bind:src="getPoster(item.poster_path)"></progressive-img>
          </div>
          <div class="col-sm-10 download-item-info">
            {{item.priority}}:{{item.release_date}}{{item.first_air_date}}:{{item.title}}{{item.name}}:{{item.key}}
          </div>
        </div>
    </transition-group>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import tvIcon from '@fortawesome/fontawesome-free-solid/faFilm'
import movieIcon from '@fortawesome/fontawesome-free-solid/faTv'
import downloadedIcon from '@fortawesome/fontawesome-free-solid/faDownload'

// import faMinusCircle from '@fortawesome/fontawesome-free-solid/faMinusCircle'

export default {
  name: 'DownloadList',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      overviewMaxChars: 250,
      filter: {
        movie: true,
        tv: true,
        downloaded: true
      },
      sort: 'priority'
    }
  },
  computed: {
    items () {
      let array = []
      for (let key in this.$store.getters.items) {
        let item = this.$store.getters.item(key)
        array.push(item)
      }
      return array
    },
    filteredItems () {
      return this.items.filter(this.filterItem)
    },
    sortedItems () {
      let filtered = this.filteredItems
      return filtered.sort(this.sortItems)
    },
    sortButtonText () {
      return this.$i18n.t('list.buttons.sort') + ': ' + this.$i18n.t('list.sort.' + this.sort)
    },
    tvIcon () {
      return tvIcon
    },
    movieIcon () {
      return movieIcon
    },
    downloadedIcon () {
      return downloadedIcon
    }
  },
  methods: {
    filterItem (item) {
      if (!this.filter.movie && item.mediaType === 'movie') {
        return false
      }
      if (!this.filter.tv && item.mediaType === 'tv') {
        return false
      }
      if (!this.filter.downloaded && item.downloaded) {
        return false
      }
      return true
    },
    sortItems (a, b) {
      if (this.sort === 'priority') {
        if (a.downloaded) return 1
        if (b.downloaded) return -1
        if (a.priority - b.priority !== 0) return a.priority - b.priority
      }
      if (this.sort === 'release') {
        let releaseA = this.getReleaseDateMoment(a)
        let releaseB = this.getReleaseDateMoment(b)
        if (releaseB - releaseA !== 0) return releaseB - releaseA
      }

      let titleA = this.getTitle(a)
      let titleB = this.getTitle(b)
      if (titleA > titleB) return 1
      if (titleA < titleB) return -1
      return 0
    },
    getReleaseDateMoment (item) {
      let date = null
      if (item.mediaType === 'movie') {
        date = item.release_date
      } else if (item.mediaType === 'tv') {
        date = item.first_air_date
      }
      let moment = this.$moment(date)
      return moment
    },
    getTitle (item) {
      if (item.mediaType === 'movie') {
        return item.title
      } else if (item.mediaType === 'tv') {
        return item.name
      }
    },
    getPoster (path) {
      if (path) {
        return 'http://image.tmdb.org/t/p/w200' + path
      } else {
        return this.$store.getters.fallbackMovieBackdrop
      }
    },
    getReleaseYear (date) {
      if (date) {
        return date.substring(0, 4)
      } else {
        return ''
      }
    },
    getOverviewShort (item) {
      let overview = item.overview
      if (overview && overview.length > this.overviewMaxChars) {
        return overview.substring(0, this.overviewMaxChars) + '…'
      }
      return item.overview
    },
    isDownloaded (id) {
      var item = this.$store.getters.item(id)
      if (item) {
        return item.downloaded
      }
      return false
    },
    hasPriority (id, priority) {
      var item = this.$store.getters.item(id)
      if (item) {
        return item.priority <= priority
      }
      return false
    },
    removeItem (id) {
      var item = this.$store.getters.item(id)
      if (item) {
        this.$store.dispatch('removeMovie', item.id)
      }
    },
    setPriority (id, p) {
      var item = this.$store.getters.item(id)
      var priority = p
      if (item) {
        if (item.priority === priority) {
          priority++
        }

        this.$store.dispatch('setMoviePriority', {
          id: item.id,
          priority: priority})
      }
    },
    changeSortMethod (method) {
      this.sort = method
    }
  },
  i18n: {
    messages: {
      de: {
        list: {
          header: 'Meine Liste',
          noItems: 'Du hast noch keine Downloads ausgewählt.',
          filter: {
            movie: 'Filme',
            tv: 'Serien',
            downloaded: 'Heruntergeladen'
          },
          item: {
            overview: 'Übersicht',
            actions: 'Aktionen',
            download: 'Download',
            successfull: 'Erfolgreich',
            priority: 'Priorität'
          },
          buttons: {
            sort: 'Sortierung'
          },
          sort: {
            priority: 'Priorität',
            title: 'Titel',
            release: 'Veröffentlichung'
          }
        }
      },
      en: {
        list: {
          header: 'My list',
          noItems: 'There are no downloads on your list. Add some Movies or TV Series to fill your download list',
          filter: {
            movie: 'Movies',
            tv: 'TV Series',
            downloaded: 'Downloaded'
          },
          item: {
            overview: 'Overview',
            actions: 'Actions',
            download: 'Download',
            successfull: 'Success',
            priority: 'Priorität'
          },
          buttons: {
            sort: 'Sorting'
          },
          sort: {
            priority: 'Download Priority',
            title: 'Title',
            release: 'Release date'
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list {
  margin: 10px 30px;
}
.menu-bar {
  margin: 0 0 20px 0;
}
.download-container {
  margin: 0;
  padding: 0;
}
.button-icon {
  margin-right: 10px;
}
.menu-bar-button {
  color: black;
}
.menu-bar-button.inactive {
  color: grey;
}

/* base */
.download-list {
  backface-visibility: hidden;
  z-index: 1;
}

/* moving */
.download-list-move {
  transition: all 600ms ease-in-out 50ms;
}

/* appearing */
.download-list-enter-active {
  transition: all 400ms ease-in-out;
  opacity: 0;
  z-index: 0;
}

/* disappearing */
.download-list-leave-active {
  position: absolute;
  opacity: 0;
  z-index: 0;
}

/* appear at / disappear to */
.download-list-enter,
.download-list-leave-to {
  opacity: 0;
}
</style>
