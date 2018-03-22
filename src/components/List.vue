<template>
  <div class="list">
    <h2>{{ $t("list.header") }}</h2>
    <h3>Work in progress&trade;</h3>
    <p>Patience you must have, my young padawan &mdash; Yoda </p>
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
import faMinusCircle from '@fortawesome/fontawesome-free-solid/faMinusCircle'
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle'

export default {
  name: 'List',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      overviewMaxChars: 250
    }
  },
  computed: {
    items () {
      return this.$store.getters.movies
    },
    checkIcon () {
      return faCheckCircle
    },
    starIcon () {
      return faStar
    },
    removeIcon () {
      return faMinusCircle
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
    }
  },
  i18n: {
    messages: {
      de: {
        list: {
          header: 'Meine Liste',
          item: {
            overview: 'Übersicht',
            actions: 'Aktionen',
            download: 'Download',
            successfull: 'Erfolgreich',
            priority: 'Priorität'
          }
        }
      },
      en: {
        list: {
          header: 'My list',
          item: {
            overview: 'Overview',
            actions: 'Actions',
            download: 'Download',
            successfull: 'Success',
            priority: 'priority'
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
