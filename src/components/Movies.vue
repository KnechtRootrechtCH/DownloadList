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
          v-for="(result) in results" :key="result.id">
          <img class="card-img" v-bind:src="result.backdrop" onerror="this.onerror=null;this.src='http://image.tmdb.org/t/p/w500/mX7mlE1kaGohnSVDMSTlrvisYf7.jpg'" alt="">
          <div class="card-img-overlay">
            <h5 class="card-title">{{ result.title }}</h5>
            <font-awesome-icon :icon="plusIcon" class="add-icon"/>
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

import {globalStore} from '../main.js'

export default {
  name: 'Movies',
  data () {
    return {
      count: 0,
      pages: 0,
      searchString: '',
      results: []
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
    }
  },
  methods: {
    updateSearch () {
      if (this.searchString === null || this.searchString.length < 3) {
        this.count = 0
        this.pages = 0
        this.suggestions = []
        return
      }
      this._.debounce(() => {
        this.$debug('calling themoviedb api', this.searchString)
        axios.get('https://api.themoviedb.org/3/search/movie?api_key=' + globalStore.movieDbApiKey + '&language=' + globalStore.language + '&query=' + this.searchString).then(
          (response) => {
            this.count = response.data.total_results
            this.pages = response.data.total_pages
            this.results = [];
            response.data.results.forEach(element => {
              if(element.backdrop_path) {
                element.backdrop = 'http://image.tmdb.org/t/p/w500' + element.backdrop_path
              } else {
                element.backdrop = 'http://image.tmdb.org/t/p/w500/w300/njv65RTipNSTozFLuF85jL0bcQe.jpg'
              }
              this.results.push(element)
            });
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
          inputPlaceholder: 'Film suchen…'
        }
      },
      en: {
        movies: {
          header: 'Movies',
          inputPlaceholder: 'Search movie…'
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
.suggestion-input{
  max-width: 300px;
}
.add-icon{
  position: absolute;
  width: 25px;
  height: 25px;
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
