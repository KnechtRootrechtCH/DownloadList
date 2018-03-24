<template>
  <div class="suggestion-list">
    <h2>{{ $t("tv.header") }}</h2>
    <div>
      <b-input-group>
        <b-input-group-prepend is-text>
          <font-awesome-icon :icon="searchIcon" />
        </b-input-group-prepend>
        <b-form-input class="suggestion-input" v-model="searchString" v-bind:placeholder="$t('tv.inputPlaceholder')"></b-form-input>
        <b-input-group-append is-text v-on:click="clearSearch">
          <font-awesome-icon :icon="timesIcon" class="suggestion-input-clear"/>
        </b-input-group-append>
      </b-input-group>
    </div>
    <b-container fluid class="suggestion-items">
      <b-row>
        <div v-for="(item, index) in suggestions" :key="item.id"
        class="suggestion-item col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
          <suggestionCard v-bind:suggestionType="suggestionType" v-bind:index="index" v-bind:id="item.id" v-bind:title="item.name" v-bind:release-date="item.first_air_date" v-bind:backdrop="item.backdrop_path"></suggestionCard>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'

import SuggestionCard from './SuggestionCard'

export default {
  name: 'Series',
  data () {
    return {
      suggestionType: 'tv',
      queryType: 'popular',
      searchString: '',
      previousSearchString: ''
    }
  },
  components: {
    FontAwesomeIcon,
    'suggestionCard': SuggestionCard
  },
  computed: {
    suggestions () {
      return this.$store.getters.tvSuggestions
    },
    searchIcon () {
      return faSearch
    },
    timesIcon () {
      return faTimes
    }
  },
  methods: {
    clearSearch () {
      this.searchString = ''
    },
    updateSearch () {
      if (this.searchString === this.previousSearchString) {
        return
      }
      this.previousSearchString = this.searchString

      if (this.searchString === null || (this.searchString.length === 0 && this.queryType === 'search')) {
        this.queryType = 'popular'
        this.$store.commit('resetTvSuggestions')
        this.$store.dispatch('getTvSuggestions', {
          'queryType': this.queryType,
          'searchString': this.searchString
        })
      } else if (this.searchString.length > 2) {
        this.queryType = 'search'
        this.$store.commit('resetTvSuggestions')
        this.$store.dispatch('getTvSuggestions', {
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
      this.$store.dispatch('getTvSuggestions', {
        'queryType': this.queryType,
        'searchString': this.searchString
      })
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
    this.queryType = 'popular'
    this.$store.commit('resetTvSuggestions')
    this.$store.dispatch('getTvSuggestions', {
      'queryType': this.queryType,
      'searchString': this.searchString
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    searchString: function (val, oldVal) {
      this.$_.debounce(this.updateSearch, 1000)()
    }
  },
  i18n: {
    messages: {
      de: {
        tv: {
          header: 'Serien',
          inputPlaceholder: 'Serie suchen…'
        }
      },
      en: {
        tv: {
          header: 'Series',
          inputPlaceholder: 'Search series…'
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
.suggestion-input-clear:hover {
  color: black;
}
.suggestion-items {
  margin-top: 20px;
}
.suggestion-item {
  padding: 0;
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
