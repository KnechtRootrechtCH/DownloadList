<template>
  <div class="browse">
    <div class="browse-navigation">
      <h2 class="browse-header noselect">{{ $t(mode) }}</h2>
      <b-collapse id="collapse-navigation" class="browse-navigation-items noselect" v-bind:visible="mode !== 'search'">
        <span class="browse-header">{{ header }}</span>
        <span class="browse-navigation-item" @click="setQueryType('popular')" v-bind:class="{ active: queryType === 'popular' }">{{ $t('popular') }}</span>
        <span class="browse-navigation-item" @click="setQueryType('top_rated')" v-bind:class="{ active: queryType === 'top_rated' }">{{ $t('topRated') }}</span>
        <span class="browse-navigation-item" @click="setQueryType('search')" v-bind:class="{ active: queryType === 'search' }">{{ $t('search') }}</span>
      </b-collapse>
      <b-collapse id="collapse-input" v-bind:visible="queryType === 'search'">
        <b-input-group class="browse-search-group">
          <!--<b-input-group-prepend is-text>
            <font-awesome-icon :icon="searchIcon" />
          </b-input-group-prepend>-->
          <b-form-input class="browse-search-input" v-model="searchString" v-bind:placeholder="$t('searchPlaceholder.' + mode)"></b-form-input>
          <b-input-group-append is-text v-on:click="clearSearch">
              <font-awesome-icon :icon="timesIcon" class="browse-search-clear"/>
          </b-input-group-append>
        </b-input-group>
      </b-collapse>
    </div>
    <div class="browse-content">
      <mediaGrid v-bind:filter="filter" v-bind:items="items"></mediaGrid>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'

import MediaGrid from './MediaGrid'

export default {
  name: 'Browse',
  props: ['mode', 'header', 'inputPlaceholder'],
  data () {
    return {
      queryType: 'popular',
      searchString: '',
      previousSearchString: '',
      filter: {
        movie: true,
        tv: true,
        downloaded: true,
        selected: true,
        notSelected: true
      }
    }
  },
  components: {
    FontAwesomeIcon,
    'mediaGrid': MediaGrid
  },
  computed: {
    items () {
      return this.$store.getters.suggestionsArray
    },
    searchIcon () {
      return faSearch
    },
    timesIcon () {
      return faTimes
    }
  },
  methods: {
    setQueryType (queryType) {
      this.queryType = queryType
      this.searchString = ''
      if (queryType !== 'search' || this.searchString > 2) {
        this.loadItems()
      }
    },
    clearSearch () {
      this.searchString = ''
    },
    updateSearch () {
      if (this.searchString === this.previousSearchString) {
        return
      }
      this.previousSearchString = this.searchString

      if (this.searchString.length === 0 && this.queryType === 'search' && this.mode !== 'search') {
        this.queryType = 'popular'
        this.loadItems()
      } else if (this.searchString.length > 2) {
        this.queryType = 'search'
        this.loadItems()
      }
    },
    loadItems (nextPage) {
      if (!nextPage) {
        this.$store.commit('resetSuggestions')
      }
      let mediaType = this.mode
      if (this.mode === 'search') {
        mediaType = 'multi'
      }
      this.$store.dispatch('getSuggestions', {
        'media_type': mediaType,
        'queryType': this.queryType,
        'searchString': this.searchString
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
      this.loadItems(true)
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
    if (this.mode === 'search') {
      this.queryType = 'search'
      return
    }
    this.loadItems()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    searchString: function (val, oldVal) {
      this.$_.debounce(this.updateSearch, 1000)()
    },
    mode: function (val, oldVal) {
      if (val === 'search') {
        this.queryType = 'search'
        if (this.searchString < 3) {
          return
        }
      }
      if (this.queryType === 'search' && this.searchString < 3) {
        this.queryType = 'popular'
      }
      this.loadItems()
    }
  },
  i18n: {
    messages: {
      de: {
        movie: 'Filme',
        tv: 'Serien',
        popular: 'Beliebt',
        topRated: 'Bestbewertet',
        search: 'Suche',
        searchPlaceholder: {
          movie: 'Film suchen…',
          tv: 'Serie suchen…',
          search: 'Film, Serie, Regisseur oder Schauspieler suchen…'
        }
      },
      en: {
        movie: 'Movies',
        tv: 'TV Shows',
        popular: 'Popular',
        topRated: 'Top Rated',
        search: 'Search',
        searchPlaceholder: {
          movie: 'Search Movie…',
          tv: 'Search TV Show…',
          search: 'Search for Movie, TV Show, Director or Actor…'
        }
      }
    }
  }
}
</script>

<style scoped>
.noselect {
  transition: transform .5s;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.browse-navigation {
  margin: 20px 20px 0 20px;
}
.browse-navigation-item {
  margin-right: 20px;
  opacity: 0.7;
  cursor: pointer;
  font-size: 18px;
}
.browse-navigation-item.active {
  opacity: 1;
  font-weight: bold;
}
.browse-navigation-item:hover {
  opacity: 1;
}
.browse-search-group {
  margin-top: 10px;
}
.browse-search-clear:hover {
  color: darkred;
}
</style>
