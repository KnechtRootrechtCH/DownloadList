<template>
  <div class="movies">
    <h2>{{ $t("movies.header") }}</h2>
    <div>
      <b-input-group>
        <b-form-input class="suggestion-input" v-model="searchString" @keyup="updateSearch" v-bind:placeholder="$t('movies.inputPlaceholder')"></b-form-input>
        <b-input-group-text slot="append">
          <font-awesome-icon :icon="searchIcon" />
        </b-input-group-text>
      </b-input-group>
    </div>
    <div class="suggestion-list">
      <div class="card-columns">
        <div class="card bg-dark text-white suggestion-card"
          v-for="(item, index) in items" :key="item.id"
          v-bind:class="{ 'suggestion-card-active': !isDownloaded(item.id) }">
          <progressive-img v-bind:src="getBackdrop(item.backdrop_path)"></progressive-img>
          <div class="card-img-overlay" v-on:click.stop="toggleItem(index, item.id)">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="card-text">{{ getReleaseYear(item.release_date) }}</p>
            <div class="info-icons">
              <font-awesome-icon :icon="infoIcon" class="info-icon" v-on:click.stop="openInformationUrl(item.id)"/>
            </div>
            <div class="toggle-icons" v-if="isDownloaded(item.id)">
              <font-awesome-icon :icon="checkIcon" class="toggle-icon check-icon"/>
            </div>
            <div class="toggle-icons" v-if="!isDownloaded(item.id) && isSelected(item.id)">
              <font-awesome-icon :icon="starIcon" class="toggle-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 5) }" v-on:click.stop="setPriority(item.id, 5)"/>
              <font-awesome-icon :icon="starIcon" class="toggle-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 4) }" v-on:click.stop="setPriority(item.id, 4)"/>
              <font-awesome-icon :icon="starIcon" class="toggle-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 3) }" v-on:click.stop="setPriority(item.id, 3)"/>
              <font-awesome-icon :icon="starIcon" class="toggle-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 2) }" v-on:click.stop="setPriority(item.id, 2)"/>
              <font-awesome-icon :icon="starIcon" class="toggle-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(item.id, 1) }" v-on:click.stop="setPriority(item.id, 1)"/>
            </div>
            <div class="toggle-icons" v-if="!isDownloaded(item.id) && !isSelected(item.id)">
              <font-awesome-icon :icon="plusIcon" class="toggle-icon add-icon"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle'
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle'
import faInfo from '@fortawesome/fontawesome-free-solid/faInfo'
import faStar from '@fortawesome/fontawesome-free-solid/faStar'

export default {
  name: 'Movies',
  data () {
    return {
      queryType: 'popular',
      count: 0,
      pages: 0,
      page: 0,
      searchString: '',
      items: []
    }
  },
  components: {
    InfiniteLoading,
    FontAwesomeIcon
  },
  computed: {
    searchIcon () {
      return faSearch
    },
    plusIcon () {
      return faPlusCircle
    },
    checkIcon () {
      return faCheckCircle
    },
    infoIcon () {
      return faInfo
    },
    starIcon () {
      return faStar
    },
    fallbackBackdrop () {
      return this.$store.getters.fallbackMovieBackdrop
    }
  },
  methods: {
    openInformationUrl (id) {
      var url = this.getInfoUrl(id)
      var win = window.open(url, '_blank')
      win.focus()
    },
    getBackdrop (path) {
      if (path) {
        return 'http://image.tmdb.org/t/p/w500' + path
      } else {
        return this.$store.getters.fallbackMovieBackdrop
      }
    },
    getInfoUrl (id) {
      if (id) {
        return 'https://www.themoviedb.org/movie/' + id
      } else {
        return 'https://www.themoviedb.org/movie/'
      }
    },
    getReleaseYear (date) {
      if (date) {
        return date.substring(0, 4)
      } else {
        return ''
      }
    },
    toggleItem (index, id) {
      var item = this.$store.getters.movie(id)
      if (item) {
        if (item.downloaded) {
          return
        }
        this.$store.dispatch('removeMovie', item.id)
      } else {
        item = this.items[index]
        item.priority = 6
        this.$store.dispatch('addMovie', item)
      }
    },
    isSelected (id) {
      var item = this.$store.getters.movie(id)
      return item
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

        if (priority >= 6) {
          this.$store.dispatch('removeMovie', item.id)
        } else {
          this.$store.dispatch('setMoviePriority', {
            id: item.id,
            priority: priority})
        }
      }
    },
    updateSearch () {
      this.queryType = 'search'
      if (this.searchString === null || this.searchString.length < 3) {
        return
      }

      this._.debounce(() => {
        this.queryType = 'search'
        this.page = 0
        this.count = 0
        this.pages = 0
        this.items = []
        this.loadItems()
      }, 1000)()
    },
    getQueryString () {
      let query = null
      switch (this.queryType) {
        case 'search':
          query = 'https://api.themoviedb.org/3/search/movie?api_key=' + this.$store.getters.movieDbApiKey + '&language=' + this.$store.getters.locale + '&page=' + (this.page + 1) + '&query=' + this.searchString
          break
        case 'popular':
          query = 'https://api.themoviedb.org/3/movie/popular?api_key=' + this.$store.getters.movieDbApiKey + '&language=' + this.$store.getters.locale + '&page=' + (this.page + 1)
          break
      }
      return query
    },
    loadItems () {
      let query = this.getQueryString()
      console.log(this.queryType, this.page, this.pages, query)

      this.$root.axios.get(query).then(
        (response) => {
          this.count = response.data.total_results
          this.pages = response.data.total_pages
          this.page = response.data.page

          response.data.results.forEach(element => {
            this.items.push(element)
          })
        })
    },
    handleScroll () {
      var d = document.documentElement
      var offset = d.scrollTop + window.innerHeight
      var height = d.offsetHeight

      if (offset === height) {
        this.infiniteScroll()
      }
    },
    infiniteScroll () {
      if (this.pages !== 0 && this.page === this.pages) {
        console.log('reached the end of the world')
        return
      }
      this.loadItems()
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)

    this.queryType = 'popular'
    this.page = 0
    this.count = 0
    this.pages = 0
    this.items = []
    this.loadItems()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    searchString: function (val, oldVal) {
      this.updateSearch()
    }
  },
  i18n: {
    messages: {
      de: {
        movies: {
          header: 'Filme',
          inputPlaceholder: 'Film suchen…',
          released: 'Veröffentlicht'
        }
      },
      en: {
        movies: {
          header: 'Movies',
          inputPlaceholder: 'Search movie…',
          released: 'Released'
        }
      }
    }
  }
}
</script>

<style scoped>
.movies {
  margin: 10px 30px;
}
.suggestion-list {
  margin-top: 20px;
}
.suggestion-card {
  background-color: #343a40;
}
.suggestion-input {
  max-width: 300px;
}
.suggestion-card-active {
  cursor: pointer;
}
h5.card-title {
  margin-bottom: 4px;
}
div.toggle-icons {
  position: absolute;
  height: 30px;
  right: 15px;
  bottom: 15px;
}
div.info-icons {
  position: absolute;
  height: 30px;
  left: 15px;
  bottom: 15px;
}
.info-icon {
  color: white;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.add-icon {
  color: white;
}
.check-icon {
  color: limegreen;
}
.toggle-icon {
  width: 30px;
  height: 30px;
}
.priority-icon {
  color: darkgrey;
}
/*
.priority-icon:hover {
    color: white;
}
*/
.priority-icon-active {
    color: yellow;
}
/*
.priority-icon-active:hover {
    color: grey;
}
*/
.card-img-overlay {
  z-index: 10;
}

@media (min-width: 350px) {
    .card-columns {
        -webkit-column-count: 1;
        -moz-column-count: 1;
        column-count: 1;
    }
}

@media (min-width: 700px) {
    .card-columns {
        -webkit-column-count: 2;
        -moz-column-count: 2;
        column-count: 2;
    }
}

@media (min-width: 1050px) {
    .card-columns {
        -webkit-column-count: 3;
        -moz-column-count: 3;
        column-count: 3;
    }
}

@media (min-width: 1400px) {
    .card-columns {
        -webkit-column-count: 4;
        -moz-column-count: 4;
        column-count: 4;
    }
}
@media (min-width: 1750px) {
    .card-columns {
        -webkit-column-count: 5;
        -moz-column-count: 5;
        column-count: 5;
    }
}
</style>
