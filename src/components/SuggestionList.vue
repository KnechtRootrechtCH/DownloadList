<template>
  <div class="list">
    <b-container fluid>
      <b-row>
        <div class="suggestion-list-header-row noselect">
          <span class="suggestion-list-header d-none d-md-inline">{{ header }}</span>
          <span class="suggestion-list-navigation" @click="setQueryType('popular')" v-bind:class="{ active: queryType === 'popular' }">{{ $t('suggestionList.popular') }}</span>
          <span class="suggestion-list-navigation" @click="setQueryType('top_rated')" v-bind:class="{ active: queryType === 'top_rated' }">{{ $t('suggestionList.topRated') }}</span>
        </div>
      </b-row>
      <b-row>
        <div class="suggestion-input-row col-xs-12 col-sm-12 col-md-8 col-lg-6 col-xl-3">
          <b-input-group class="suggestion-input-group">
            <b-input-group-prepend is-text>
              <font-awesome-icon :icon="searchIcon" />
            </b-input-group-prepend>
            <b-form-input class="suggestion-input" v-model="searchString" v-bind:placeholder="inputPlaceholder"></b-form-input>
            <b-input-group-append is-text v-on:click="clearSearch">
              <font-awesome-icon :icon="timesIcon" class="suggestion-input-clear"/>
            </b-input-group-append>
          </b-input-group>
        </div>
      </b-row>
      <transition-group name="suggestion-list" tag="div" class="row suggestion-items">
        <div v-for="(item) in suggestions" :key="item.key"
        class="suggestion-item col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
          <suggestionCard v-bind:item="item" mode="suggestionCard"></suggestionCard>
        </div>
      </transition-group>
    </b-container>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'

import MediaCard from './MediaCard'

export default {
  name: 'SuggestionList',
  props: ['mediaType', 'header', 'inputPlaceholder'],
  data () {
    return {
      queryType: 'popular',
      searchString: '',
      previousSearchString: ''
    }
  },
  components: {
    FontAwesomeIcon,
    'suggestionCard': MediaCard
  },
  computed: {
    suggestions () {
      return this.$store.getters.suggestions
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
    setQueryType (queryType) {
      this.queryType = queryType
      this.searchString = ''
      this.$store.commit('resetSuggestions')
      this.$store.dispatch('getSuggestions', {
        'mediaType': this.mediaType,
        'queryType': this.queryType,
        'searchString': this.searchString
      })
    },
    updateSearch () {
      if (this.searchString === this.previousSearchString) {
        return
      }
      this.previousSearchString = this.searchString

      if (this.searchString === null || (this.searchString.length === 0 && this.queryType === 'search')) {
        this.queryType = 'popular'
        this.$store.commit('resetSuggestions')
        this.$store.dispatch('getSuggestions', {
          'mediaType': this.mediaType,
          'queryType': this.queryType,
          'searchString': this.searchString
        })
      } else if (this.searchString.length > 2) {
        this.queryType = 'search'
        this.$store.commit('resetSuggestions')
        this.$store.dispatch('getSuggestions', {
          'mediaType': this.mediaType,
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
      this.$store.dispatch('getSuggestions', {
        'mediaType': this.mediaType,
        'queryType': this.queryType,
        'searchString': this.searchString
      })
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
    this.queryType = 'popular'
    this.$store.commit('resetSuggestions')
    this.$store.dispatch('getSuggestions', {
      'mediaType': this.mediaType,
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
        suggestionList: {
          popular: 'Beliebt',
          latest: 'Neueste',
          topRated: 'Beste Bewertung'
        }
      },
      en: {
        suggestionList: {
          popular: 'Popular',
          latest: 'Latest',
          topRated: 'Top Rated'
        }
      }
    }
  }
}
</script>

<style scoped>
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}
.list {
  margin: 10px 30px;
}
.suggestion-list-header-row {
  margin: 5px 0 5px 0;
}
.suggestion-list-header {
  font-size: 36px;
  margin-right: 20px;
}
.suggestion-list-navigation {
  margin-right: 20px;
  opacity: 0.7;
  cursor: pointer;
}
.suggestion-list-navigation.active {
  opacity: 1;
  font-weight: bold;
}
.suggestion-list-navigation:hover {
  opacity: 1;
}
.suggestion-input-row {
  padding: 0 15px 0 0;
}
.suggestion-input-group {
  padding: 0;
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
.suggestion-list-enter-active {
  transition: opacity 1.5s;
}
.suggestion-list-leave-active {
  transition: opacity 0.5s;
}
.suggestion-list-enter, .suggestion-list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
