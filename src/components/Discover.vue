<template>
  <div class="discover">
    <div class="discover-navigation">
      <h2 class="discover-header noselect">{{ $t(mode) }}</h2>
      <b-collapse id="collapse-navigation" class="discover-navigation-items noselect" v-bind:visible="mode !== 'discover'">
        <span class="discover-navigation-item" @click="setQueryType('popular')" v-bind:class="{ active: queryType === 'popular' }">{{ $t('popular') }}</span>
        <span class="discover-navigation-item" @click="setQueryType('top_rated')" v-bind:class="{ active: queryType === 'top_rated' }">{{ $t('topRated') }}</span>
        <span class="discover-navigation-item" @click="setQueryType('search')" v-bind:class="{ active: queryType === 'search' }">{{ $t('search') }}</span>
      </b-collapse>
      <b-collapse id="collapse-input" v-bind:visible="queryType === 'search'">
        <b-input-group class="discover-search-group">
          <!--<b-input-group-prepend is-text>
            <font-awesome-icon :icon="searchIcon" />
          </b-input-group-prepend>-->
          <b-form-input class="discover-search-input" v-model="searchString" v-bind:placeholder="$t('searchPlaceholder.' + mode)"></b-form-input>
          <b-input-group-append is-text v-on:click="clearSearch">
              <font-awesome-icon :icon="icon('times')" class="discover-search-clear"/>
          </b-input-group-append>
        </b-input-group>
      </b-collapse>
    </div>
    <div class="discover-content">
      <mediaGrid
        mode="discover"
        v-bind:items="items"
        detailsRouterPrefix="browse">
      ></mediaGrid>
    </div>
  </div>
</template>

<script>
import MediaGrid from './MediaGrid'
import IconsMixin from '../mixins/icons'

export default {
  name: 'discover',
  props: ['mode', 'header', 'inputPlaceholder'],
  mixins: [IconsMixin],
  data () {
    return {
      queryType: 'popular',
      searchString: '',
      previousSearchString: ''
    }
  },
  components: {
    'mediaGrid': MediaGrid
  },
  computed: {
    items () {
      let items = this.$store.getters.suggestionsArray
      return items
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

      if (this.searchString.length === 0 && this.queryType === 'search') {
        return
      }
      this.loadItems()
    },
    loadItems (nextPage) {
      if (!nextPage) {
        this.$store.commit('resetSuggestions')
      }
      let mediaType = this.mode
      let queryType = this.queryType
      if (this.mode === 'discover' && this.queryType === 'search') {
        if (this.searchString.length > 2) {
          mediaType = 'multi'
        } else {
          mediaType = 'movie'
          queryType = 'popular'
        }
      }
      this.$store.dispatch('getSuggestions', {
        'media_type': mediaType,
        'queryType': queryType,
        'searchString': this.searchString
      })
    },
    handleScroll () {
      let d = document.documentElement
      let offset = d.scrollTop + window.innerHeight
      let height = d.offsetHeight

      if (offset >= height - 100) {
        this.infiniteScroll()
      }
    },
    infiniteScroll () {
      this.loadItems(true)
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
    if (this.mode === 'discover') {
      this.queryType = 'search'
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
      if (val === 'discover') {
        this.queryType = 'search'
      }
      if (val !== 'discover' && this.queryType === 'search' && this.searchString.length < 3) {
        this.queryType = 'popular'
      }
      this.loadItems()
    }
  },
  i18n: {
    messages: {
      de: {
        discover: 'Entdecken',
        movie: 'Filme',
        tv: 'Serien',
        popular: 'Beliebt',
        topRated: 'Bestbewertet',
        search: 'Suchen',
        searchPlaceholder: {
          movie: 'Film suchen…',
          tv: 'Serie suchen…',
          discover: 'Film, Serie oder Person…'
        }
      },
      en: {
        discover: 'Discover',
        movie: 'Movies',
        tv: 'TV Shows',
        popular: 'Popular',
        topRated: 'Top Rated',
        search: 'Search',
        searchPlaceholder: {
          movie: 'Search Movie…',
          tv: 'Search TV Show…',
          discover: 'Movie, TV Show or Person…'
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
.discover-navigation {
  margin: 20px 20px 0 20px;
}
.discover-navigation-item {
  opacity: 0.7;
  cursor: pointer;
  font-size: 20px;
  margin: 0 10px 0 10px;
}
.discover-navigation-item:first-child {
  margin: 0 10px 0 1px;
}
.discover-navigation-item:last-child {
  margin: 0 0 0 10px;
}
.discover-navigation-item.active {
  opacity: 1;
}
.discover-navigation-item:hover {
  opacity: 1;
}
.discover-search-group {
  margin-top: 10px;
}
.discover-search-clear:hover {
  color: darkred;
}
</style>
