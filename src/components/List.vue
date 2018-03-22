<template>
  <div class="list">
    <h2>{{ $t("list.header") }}</h2>
    <div v-if="!items" class="download-item-info-section">
        {{ $t("list.noItems") }}
    </div>
    <div class="menu-bar">
      <b-dropdown id="sort-dropdown" v-bind:text="sortButtonText" class="m-md-2 menu-bar-button" variant="dark">
        <b-dropdown-item-button v-on:click="changeSortMethod('title')">{{ $t("list.sort.title") }}</b-dropdown-item-button>
        <b-dropdown-item-button v-on:click="changeSortMethod('priority')">{{ $t("list.sort.priority") }}</b-dropdown-item-button>
        <b-dropdown-item-button v-on:click="changeSortMethod('release')">{{ $t("list.sort.release") }}</b-dropdown-item-button>
      </b-dropdown>
    </div>
    <div class="download-list">
      <div class="download-item"
        v-for="(item) in items" :key="item.id">
          <div class="container">
            <div class="row">
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
                    <font-awesome-icon :icon="starIcon" class="download-item-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 5) }" v-on:click.stop="setPriority(item.id, 5)"/>
                    <font-awesome-icon :icon="starIcon" class="download-item-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 4) }" v-on:click.stop="setPriority(item.id, 4)"/>
                    <font-awesome-icon :icon="starIcon" class="download-item-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 3) }" v-on:click.stop="setPriority(item.id, 3)"/>
                    <font-awesome-icon :icon="starIcon" class="download-item-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 2) }" v-on:click.stop="setPriority(item.id, 2)"/>
                    <font-awesome-icon :icon="starIcon" class="download-item-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 1) }" v-on:click.stop="setPriority(item.id, 1)"/>
                  </div>
                </div>
                <div class="download-item-info-section">
                  <div class="download-item-header">{{ $t("list.item.overview") }}</div>
                  <p class="download-item-content">{{ item.overview }}</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faStar from '@fortawesome/fontawesome-free-solid/faStar'
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash'
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle'
// import faMinusCircle from '@fortawesome/fontawesome-free-solid/faMinusCircle'

export default {
  name: 'List',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      overviewMaxChars: 250,
      sort: 'priority'
    }
  },
  computed: {
    items () {
      let items = this.$store.getters.movies
      items = this.sortItems(items, this.sort)
      return items
    },
    checkIcon () {
      return faCheckCircle
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
      var item = this.$store.getters.movie(id)
      if (item) {
        return item.downloaded
      }
      return false
    },
    hasPriority (id, priority) {
      var item = this.$store.getters.movie(id)
      if (item) {
        return item.priority <= priority
      }
      return false
    },
    removeItem (id) {
      var item = this.$store.getters.movie(id)
      if (item) {
        this.$store.dispatch('removeMovie', item.id)
      }
    },
    setPriority (id, p) {
      var item = this.$store.getters.movie(id)
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
    },
    sortItems (items, sort) {
      let array = []
      for (let id in items) {
        let item = this.$store.getters.movie(id)
        array.push(item)
      }

      // title sort as default
      array.sort((a, b) => {
        if (a.title > b.title) return 1
        if (a.title < b.title) return -1
        return 0
      })

      switch (sort) {
        case 'priority':
          console.log('prio sort')
          array.sort((a, b) => {
            if (a.downloaded) return true
            if (b.downloaded) return false
            if (a.priority < b.priority) return -1
            if (a.priority > b.priority) return 1
            return 0
          })
          break
        case 'release':
          array.sort((a, b) => {
            if (a.release_date > b.release_date) return -1
            if (a.release_date < b.release_date) return 1
            return 0
          })

          break
      }
      return array
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
            priority: 'Download Priorität',
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
.download-item {
  margin-bottom: 15px;
}
.download-item .container {
  width: 100%;
  margin: 0;
  padding: 0;
}
.download-item .row {
  margin: 0;
  padding: 0;
}
.download-item .download-item-title {
  font-size: 25px;
  font-weight: bold;
  color: white;
}
.download-item .download-item-release {
  opacity: 0.6;
}
.download-item .download-item-media {
  padding: 0;
  margin: 0 10px 10px 0;
}
.download-item .download-item-info {
  margin: 0;
  padding: 0;
}
.download-item .download-item-info-section {
  margin-top: 15px;
}
.download-item .download-item-header {
  font-weight: bold;
  margin-bottom: 5px;
}
.download-item .download-item-content {
  font-size: 14px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.download-item .download-item-icon-group {
  margin-right: 15px;
}
.download-item-icon {
  width: 20px;
  height: 20px;
}
.downloaded-icon {
  color: green;
}
.remove-icon {
  margin-right: 5px;
}
.remove-icon:hover {
  color: red;
  cursor: pointer;
}
.priority-icon {
  color: darkgrey;
  cursor: pointer;
}
.priority-icon-active {
    color: yellow;
    cursor: pointer;
}
@media (min-width: 0px) {
  .hidden-sm-down {
    display: none;
  }
  .hidden-md-down {
    display: none;
  }
}
@media (min-width: 350px) {
  .hidden-sm-down {
    display: none;
  }
  .hidden-md-down {
    display: none;
  }
}

@media (min-width: 700px) {
  .hidden-sm-down {
    display: block;
  }
  .hidden-md-down {
    display: none;
  }
}

@media (min-width: 1050px) {
  .hidden-sm-down {
    display: block;
  }
  .hidden-md-down {
    display: block;
  }
}

@media (min-width: 1400px) {
  .hidden-sm-down {
    display: block;
  }
  .hidden-md-down {
    display: block;
  }
}

@media (min-width: 1750px) {
  .hidden-sm-down {
    display: block;
  }
  .hidden-md-down {
    display: block;
  }
}
</style>
