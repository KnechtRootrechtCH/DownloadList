<template>
  <div class="list">
    <b-container fluid>
      <b-row>
        <div>
          <span class="download-list-header">{{ $t("list.header") }}</span>
          <span class="download-list-navigation" @click="setFilter('movie')" v-bind:class="{ active: filter.movie && !filter.tv }">{{ $t('list.filter.movie') }}</span>
          <span class="download-list-navigation" @click="setFilter('tv')" v-bind:class="{ active: filter.tv && !filter.movie }">{{ $t('list.filter.tv') }}</span>
          <span class="download-list-navigation" @click="setFilter('all')" v-bind:class="{ active: filter.tv && filter.movie }">{{ $t('list.filter.all') }}</span>
        </div>
      </b-row>
      <!--<b-row>
        <b-dropdown v-bind:text="sortButtonText" :icon="movieIcon" class="m-md-2 menu-bar-button " variant="light">
          <b-dropdown-item-button v-on:click="changeSortMethod('title')">{{ $t("list.sort.title") }}</b-dropdown-item-button>
          <b-dropdown-item-button v-on:click="changeSortMethod('priority')">{{ $t("list.sort.priority") }}</b-dropdown-item-button>
          <b-dropdown-item-button v-on:click="changeSortMethod('release')">{{ $t("list.sort.release") }}</b-dropdown-item-button>
        </b-dropdown>
      </b-row>-->
      <transition-group name="download-list" tag="div" class="row download-items">
        <div v-for="(item) in sortedItems" :key="item.key"
          class="download-item col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
          <downloadCard v-bind:item="item" mode="downloadList"></downloadCard>
        </div>
      </transition-group>
    </b-container>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import tvIcon from '@fortawesome/fontawesome-free-solid/faFilm'
import movieIcon from '@fortawesome/fontawesome-free-solid/faTv'
import downloadedIcon from '@fortawesome/fontawesome-free-solid/faDownload'
import sortIcon from '@fortawesome/fontawesome-free-solid/faSortAlphaDown'

import MediaCard from './MediaCard'

export default {
  name: 'DownloadList',
  components: {
    FontAwesomeIcon,
    'downloadCard': MediaCard
  },
  data () {
    return {
      overviewMaxChars: 250,
      filter: {
        movie: true,
        tv: false,
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
    },
    sortIcon () {
      return sortIcon
    }
  },
  methods: {
    setFilter (filter) {
      if (filter === 'all') {
        this.filter.movie = true
        this.filter.tv = true
      } else if (filter === 'movie') {
        this.filter.movie = true
        this.filter.tv = false
      } else if (filter === 'tv') {
        this.filter.movie = false
        this.filter.tv = true
      }
    },
    filterItem (item) {
      if (item.priority <= 0) {
        return false
      }
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
            all: 'Alle',
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
            all: 'Everything',
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
.download-list-header {
  font-size: 36px;
}
.download-list-navigation {
  margin-left: 20px;
  opacity: 0.7;
  cursor: pointer;
}
.download-list-navigation.active {
  opacity: 1;
  font-weight: bold;
}
.download-list-navigation:hover {
  opacity: 1;
}
.download-item {
  padding: 0;
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
  transition: all 400ms ease-out;
}

/* disappearing */
.download-list-leave-active {
  transition: all 200ms ease-in;
  position: absolute;
  z-index: 0;
}

/* appear at / disappear to */
.download-list-enter,
.download-list-leave-to {
  opacity: 0;
}
</style>
