<template>
  <div class="list">
    <h2>{{ $t("list.header") }}</h2>
    <div v-if="!items" class="download-item-info-section">
        {{ $t("list.noItems") }}
    </div>
    <div class="menu-bar">
      <b-button class="m-md-2 menu-bar-button" variant="dark">TestTestTest</b-button>
      <b-button class="m-md-2 menu-bar-button button-active" variant="light">TestTestTest</b-button>
      <b-dropdown v-bind:text="sortButtonText" class="m-md-2 menu-bar-button" variant="light">
        <b-dropdown-item-button v-on:click="changeSortMethod('title')">{{ $t("list.sort.title") }}</b-dropdown-item-button>
        <b-dropdown-item-button v-on:click="changeSortMethod('priority')">{{ $t("list.sort.priority") }}</b-dropdown-item-button>
        <b-dropdown-item-button v-on:click="changeSortMethod('release')">{{ $t("list.sort.release") }}</b-dropdown-item-button>
      </b-dropdown>
    </div>
    <div class="download-list container-fluid">

        <div class="download-item row" v-for="(item) in sortedItems" :key="item.key">
          <div class="col-sm-2 hidden-md-down download-item-media">
            <progressive-img class="download-item-poster" v-bind:src="getPoster(item.poster_path)"></progressive-img>
          </div>
          <div class="col-sm-10 download-item-info">
            {{item.priority}}:{{item.release_date}}{{item.first_air_date}}:{{item.title}}{{item.name}}:{{item.key}}
          </div>
        </div>
      <!--
      <div class="download-item row"
        v-for="(item) in items"
        :key="item.id">
          <div class="col-sm-2 hidden-md-down download-item-media">
            <progressive-img class="download-item-poster" v-bind:src="getPoster(item.poster_path)"></progressive-img>
          </div>
          <div class="col-sm-8 download-item-info">
            <div>
              <span class="download-item-title">{{ item.title }}</span> <span class="download-item-release">({{ getReleaseYear(item.release_date) }})</span>
            </div>
            <div v-if="isDownloaded(item.id)" class="download-item-info-section">
              <div class="download-item-icon-group">
                <div class="download-item-header">{{ $t("list.item.download") }}</div>
                <font-awesome-icon :icon="checkIcon" class="download-item-icon downloaded-icon"/>
                {{ $t("list.item.successfull") }}
              </div>
              </div>
            <div v-if="!isDownloaded(item.id)" class="download-item-info-section">
              <div class="download-item-icon-group">
                <div class="download-item-header">{{ $t("list.item.priority") }}</div>
                <font-awesome-icon :icon="removeIcon" class="download-item-icon remove-icon" v-on:click.stop="removeItem(item.id)"/>
                <font-awesome-icon :icon="exclamationIcon" class="download-item-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 3) }" v-on:click.stop="setPriority(item.id, 3)"/>
                <font-awesome-icon :icon="exclamationIcon" class="download-item-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 2) }" v-on:click.stop="setPriority(item.id, 2)"/>
                <font-awesome-icon :icon="exclamationIcon" class="download-item-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 1) }" v-on:click.stop="setPriority(item.id, 1)"/>
              </div>
            </div>
            <div class="download-item-info-section">
              <div class="download-item-header">{{ $t("list.item.overview") }}</div>
              <p class="download-item-content">{{ item.overview }}</p>
            </div>
          </div>
      </div>
      -->
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faStar from '@fortawesome/fontawesome-free-solid/faStar'
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash'
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle'
import faExclamationCircle from '@fortawesome/fontawesome-free-solid/faExclamationCircle'
// import faMinusCircle from '@fortawesome/fontawesome-free-solid/faMinusCircle'

export default {
  name: 'List',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      overviewMaxChars: 250,
      filter: {
        movie: true,
        tv: true
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
    checkIcon () {
      return faCheckCircle
    },
    exclamationIcon () {
      return faExclamationCircle
    },
    starIcon () {
      return faStar
    },
    removeIcon () {
      return faTrash
    },
    sortButtonText () {
      return this.$i18n.t('list.buttons.sort') + ': ' + this.$i18n.t('list.sort.' + this.sort)
    }
  },
  methods: {
    filterItem (item) {
      if (item.mediaType === 'movie' && !this.filter.movie) {
        return false
      }
      if (item.mediaType === 'tv' && !this.filter.tv) {
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
.menu-bar .menu-bar-button {
  margin: 0 20px 0 0 !important;
}
.download-list {
  margin: 0;
  padding: 0;
}
.download-item {
  margin-bottom: 20px;
}

</style>
