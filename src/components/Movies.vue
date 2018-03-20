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
          v-for="(item, index) in items" :key="item.id">
          <img class="card-img" v-bind:src="getBackdrop(item.backdrop_path)" onerror="this.onerror=null;this.src='http://image.tmdb.org/t/p/w500/mX7mlE1kaGohnSVDMSTlrvisYf7.jpg'" alt="">
          <div class="card-img-overlay" v-on:click.stop="toggleItem(index, item.id)">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="card-text">{{ getReleaseYear(item.release_date) }}</p>
            <a v-bind:href="getInfoUrl(item.id)" target="_blank"><font-awesome-icon :icon="infoIcon" class="info-icon"/></a>
            <font-awesome-icon v-if="isSelected(item.id)" :icon="checkIcon" class="toggle-icon check-icon"/>
            <font-awesome-icon v-if="!isSelected(item.id)" :icon="plusIcon" class="toggle-icon add-icon"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle'
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle'
import faInfo from '@fortawesome/fontawesome-free-solid/faInfo'

export default {
  name: 'Movies',
  data () {
    return {
      count: 0,
      pages: 0,
      searchString: '',
      items: []
    }
  },
  components: {
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
    }
  },
  methods: {
    getBackdrop (path) {
      if (path) {
        return 'http://image.tmdb.org/t/p/w500' + path
      } else {
        return 'http://image.tmdb.org/t/p/w500/w300/njv65RTipNSTozFLuF85jL0bcQe.jpg'
      }
    },
    getInfoUrl (id) {
      if (id)
      {
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
      var item = this.$store.state.movies.find(i => i.id === id)
      if (item) {
        this.$store.state.movies = this.$store.state.movies.filter(i => i.id !== item.id)
      } else {
        item = this.items[index]
        this.$store.state.movies.push(item)
      }
    },
    isSelected (id) {
      var item = this.$store.state.movies.find(i => i.id === id)
      return item
    },
    updateSearch () {
      if (this.searchString === null || this.searchString.length < 3) {
        this.count = 0
        this.pages = 0
        this.suggestions = []
        return
      }
      this._.debounce(() => {
        this.$debug('calling themoviedb api', this.searchString)
        axios.get('https://api.themoviedb.org/3/search/movie?api_key=' + this.$store.state.movieDbApiKey + '&language=' + this.$store.state.language + '&query=' + this.searchString).then(
          (response) => {
            this.count = response.data.total_results
            this.pages = response.data.total_pages
            this.items = []
            response.data.results.forEach(element => {
              this.items.push(element)
            })
          })
      }, 1000)()
    }
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
.suggestion-card {
  cursor: pointer;
}
h5.card-title {
  margin-bottom: 4px;
}
.info-icon{
  color: white;
  position: absolute;
  width: 30px;
  height: 30px;
  left: 15px;
  bottom: 15px;
}
.add-icon {
  color: white;
}
.check-icon {
  color: limegreen;
}
.toggle-icon{
  position: absolute;
  width: 30px;
  height: 30px;
  right: 15px;
  bottom: 15px;
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
