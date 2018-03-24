<template>
  <div class="suggestion-list">
    <h2>{{ $t("movies.header") }}</h2>
    <div>
      <b-input-group>
        <b-form-input class="suggestion-input" v-model="searchString" @keyup="updateSearch" v-bind:placeholder="$t('movies.inputPlaceholder')"></b-form-input>
        <b-input-group-text slot="append">
          <font-awesome-icon :icon="searchIcon" />
        </b-input-group-text>
      </b-input-group>
    </div>
    <div class="mansonry-container">
      <div v-masonry transition-duration="0" item-selector=".masonry-item" percent-position="true" horizontal-order="true">
        <div v-masonry-tile
          class="masonry-item"
          v-for="(item, index) in suggestions" :key="item.id"
          >
          <movie v-bind:index="index" v-bind:id="item.id" v-bind:title="item.title" v-bind:release-date="item.release_date" v-bind:backdrop="item.backdrop_path"></movie>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'

import Movie from './Movie'

export default {
  name: 'Movies',
  data () {
    return {
      queryType: 'popular',
      loading: false,
      count: 0,
      pages: 0,
      page: 0,
      searchString: '',
      items: []
    }
  },
  components: {
    FontAwesomeIcon,
    'movie': Movie
  },
  computed: {
    suggestions () {
      return this.$store.getters.movieSuggestions
    },
    searchIcon () {
      return faSearch
    }
  },
  methods: {
    updateSearch () {
      if (this.searchString === null || (this.searchString.length === 0 && this.queryType === 'search')) {
        this.queryType = 'popular'
        this.$store.commit('resetMovieSuggestions')
        this.$store.dispatch('getMovieSuggestions', {
          'queryType': this.queryType,
          'searchString': this.searchString
        })
      } else if (this.searchString.length > 2) {
        this.queryType = 'search'
        this.$store.commit('resetMovieSuggestions')
        this.$store.dispatch('getMovieSuggestions', {
          'queryType': this.queryType,
          'searchString': this.searchString
        })
      }
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
        return
      }
      this.$store.dispatch('getMovieSuggestions', {
        'queryType': this.queryType,
        'searchString': this.searchString
      })
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
    this.queryType = 'popular'
    this.$store.commit('resetMovieSuggestions')
    this.$store.dispatch('getMovieSuggestions', {
      'queryType': this.queryType,
      'searchString': this.searchString
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    searchString: function (val, oldVal) {
      this._.debounce(this.updateSearch, 1000)()
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
.suggestion-list {
  margin: 10px 30px;
}
.suggestion-input {
  max-width: 300px;
}
.mansonry-container {
  margin-top: 20px;
}

@media (min-width: 350px) {
    .masonry-item {
      width: 100%;
    }
    .card-columns {
        -webkit-column-count: 1;
        -moz-column-count: 1;
        column-count: 1;
    }
}

@media (min-width: 700px) {
  .masonry-item {
      width: 50%;
    }
    .card-columns {
        -webkit-column-count: 2;
        -moz-column-count: 2;
        column-count: 2;
    }
}

@media (min-width: 1050px) {
    .masonry-item {
      width: 33.3%;
    }
    .card-columns {
        -webkit-column-count: 3;
        -moz-column-count: 3;
        column-count: 3;
    }
}

@media (min-width: 1400px) {
    .masonry-item {
      width: 25%;
    }
    .card-columns {
        -webkit-column-count: 4;
        -moz-column-count: 4;
        column-count: 4;
    }
}
@media (min-width: 1750px) {
    .masonry-item {
      width: 20%;
    }
}
</style>
