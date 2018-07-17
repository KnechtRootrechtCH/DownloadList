<template>
  <div class="checklist">
    <div class="checklist-navigation">
      <h2 class="checklist-header noselect">{{ $t('checklist') }}</h2>
      <b-collapse id="collapse-navigation" class="checklist-navigation-items noselect" v-bind:visible="mode !== 'discover'">
        <b-container fluid>
          <b-row>
            <b-col cols="8" md="6" class="checklist-navigation-colunn">
              <span class="checklist-navigation-item" @click="filter.movie = true, filter.tv = true" v-bind:class="{ active: filter.movie && filter.tv }">{{ $t('all') }}</span>
              <span class="checklist-navigation-item" @click="filter.movie = true, filter.tv = false" v-bind:class="{ active: filter.movie && ! filter.tv }">{{ $t('movie') }}</span>
              <span class="checklist-navigation-item" @click="filter.tv = true, filter.movie = false" v-bind:class="{ active: filter.tv && !filter.movie }">{{ $t('tv') }}</span>
            </b-col>
            <b-col cols="4" md="6" class="text-right checklist-navigation-colunn">
              <!--
              <span class="checklist-navigation-item" @click="searchPanelActive = !searchPanelActive, filterPanelActive = false, sortPanelActive = false" v-bind:class="{ active: sortPanelActive }">
                <span class="d-none d-lg-inline">{{$t('search') }}</span>
                <font-awesome-icon :icon="icon('search')" class="checklist-navigation-icon"/>
              </span>
              -->
              <span  v-if="settings.showFilterReset" class="checklist-navigation-item" @click="resetFilters">
                <span class="d-none d-lg-inline">{{$t('reset') }}</span>
                <font-awesome-icon :icon="icon('undo')" class="checklist-navigation-icon"/>
              </span>
              <span v-if="!settings.alwaysShowPriorityIcons" class="checklist-navigation-item" @click="editPriorities = !editPriorities" v-bind:class="{ active: editPriorities }">
                <span class="d-none d-lg-inline">{{$t('edit') }}</span>
                <font-awesome-icon :icon="icon('star')" class="checklist-navigation-icon"/>
              </span>
              <span class="checklist-navigation-item" @click="sortPanelActive = !sortPanelActive, filterPanelActive = false" v-bind:class="{ active: sortPanelActive }">
                <span class="d-none d-lg-inline">{{$t('sort') }}</span>
                <font-awesome-icon :icon="icon('sort')" class="checklist-navigation-icon"/>
              </span>
              <span class="checklist-navigation-item" @click="filterPanelActive = !filterPanelActive, sortPanelActive = false" v-bind:class="{ active: filterPanelActive }">
                <span class="d-none d-lg-inline">{{$t('filter') }}</span>
                <font-awesome-icon :icon="icon('filter')" class="checklist-navigation-icon" transform="shrink-2"/>
              </span>
            </b-col>
          </b-row>
        </b-container>
      </b-collapse>
      <b-collapse id="collapse-filter" v-bind:visible="filterPanelActive">
        <b-container fluid class="checklist-filter-panel">
          <b-row class="checklist-filter-row">
            <b-col class="checklist-filter-items text-right">
              {{ $t('priority') }}
              <b-button-group>
                <b-button v-if="settings.priority.max <= 1 && settings.priority.min >= 1" v-bind:class="{ 'btn-dark' : !filter.priority1}" @click="filter.priority1 = !filter.priority1" size="sm">
                  {{ settings.priority.min }}&nbsp;<font-awesome-icon :icon="icon('star')"/>
                </b-button>
                <b-button v-if="settings.priority.max <= 2 && settings.priority.min >= 2" v-bind:class="{ 'btn-dark' : !filter.priority2}" @click="filter.priority2 = !filter.priority2" size="sm">
                  {{ settings.priority.min -1 }}&nbsp;<font-awesome-icon :icon="icon('star')"/>
                </b-button>
                <b-button v-if="settings.priority.max <= 3 && settings.priority.min >= 3" v-bind:class="{ 'btn-dark' : !filter.priority3}" @click="filter.priority3 = !filter.priority3" size="sm">
                  {{ settings.priority.min -2 }}&nbsp;<font-awesome-icon :icon="icon('star')"/>
                </b-button>
                <b-button v-if="settings.priority.max <= 4 && settings.priority.min >= 4" v-bind:class="{ 'btn-dark' : !filter.priority4}" @click="filter.priority4 = !filter.priority4" size="sm">
                  {{ settings.priority.min -3 }}&nbsp;<font-awesome-icon :icon="icon('star')"/>
                </b-button>
                <b-button v-if="settings.priority.max <= 5 && settings.priority.min >= 5" v-bind:class="{ 'btn-dark' : !filter.priority5}" @click="filter.priority5 = !filter.priority5" size="sm">
                  {{ settings.priority.min -4 }}&nbsp;<font-awesome-icon :icon="icon('star')"/>
                </b-button>
              </b-button-group>
            </b-col>
          </b-row>
          <b-row class="checklist-filter-row">
            <b-col class="checklist-filter-items text-right">
              {{ $t('status') }}
              <b-button-group>
                <b-button v-bind:class="{ 'btn-dark' : !filter.notYetAvailable}" @click="filter.notYetAvailable = !filter.notYetAvailable" size="sm">
                  <font-awesome-icon :icon="icon('calendar')"/>
                </b-button>
                <b-button v-bind:class="{ 'btn-dark' : !filter.hardToFind}" @click="filter.hardToFind = !filter.hardToFind" size="sm">
                  <font-awesome-icon :icon="icon('spinner')"/>
                </b-button>
                <b-button v-bind:class="{ 'btn-dark' : !filter.todo}" @click="filter.todo = !filter.todo" size="sm">
                  <font-awesome-icon :icon="icon('clock')"/>
                </b-button>
                <b-button v-bind:class="{ 'btn-dark' : !filter.queued}" @click="filter.queued = !filter.queued" size="sm">
                  <font-awesome-icon :icon="icon('download')"/>
                </b-button>
                <b-button v-bind:class="{ 'btn-dark' : !filter.downloaded}" @click="filter.downloaded = !filter.downloaded" size="sm">
                  <font-awesome-icon :icon="icon('check')"/>
                </b-button>
              </b-button-group>
            </b-col>
          </b-row>
        </b-container>
      </b-collapse>
      <b-collapse id="collapse-sort" v-bind:visible="sortPanelActive">
        <b-container fluid class="checklist-filter-panel">
          <b-row class="checklist-filter-row">
            <b-col class="checklist-filter-items text-right">
              <b-button-group>
                <b-button v-bind:class="{ 'btn-dark' : sort !== 'priority'}" @click="sort = 'priority'" size="sm">{{ $t('priority') }}</b-button>
                <b-button v-bind:class="{ 'btn-dark' : sort !== 'title'}" @click="sort = 'title'" size="sm">{{ $t('title') }}</b-button>
                <b-button v-bind:class="{ 'btn-dark' : sort !== 'rating'}" @click="sort = 'rating'" size="sm">{{ $t('rating') }}</b-button>
                <b-button class="d-none d-sm-inline" v-bind:class="{ 'btn-dark' : sort !== 'popularity'}" @click="sort = 'popularity'" size="sm">{{ $t('popularity') }}</b-button>
                <b-button class="d-none d-sm-inline" v-bind:class="{ 'btn-dark' : sort !== 'release'}" @click="sort = 'release'" size="sm">{{ $t('release') }}</b-button>
              </b-button-group>
            </b-col>
          </b-row>
        </b-container>
      </b-collapse>
      <b-collapse id="collapse-input" v-bind:visible="true">
        <b-input-group class="checklist-search-group">
          <!--<b-input-group-prepend is-text>
            <font-awesome-icon :icon="searchIcon" />
          </b-input-group-prepend>-->
          <b-form-input class="checklist-search-input" v-model="filter.text" v-bind:placeholder="$t('searchPlaceholder')"></b-form-input>
          <b-input-group-append is-text v-on:click="filter.text = ''">
              <font-awesome-icon :icon="icon('times')" class="checklist-search-clear"/>
          </b-input-group-append>
        </b-input-group>
      </b-collapse>
    </div>
    <div class="checklist-content">
      <mediaGrid
        mode="list"
        v-bind:items="items"
        v-bind:filter="filter"
        v-bind:sort="sort"
        v-bind:paging="true"
        v-bind:page="page"
        v-bind:showPriorityIcons="editPriorities || settings.alwaysShowPriorityIcons"
        pageSize="20"
        detailsRouterPrefix="list">
      </mediaGrid>
    </div>
  </div>
</template>

<script>
import MediaGrid from './MediaGrid'
import IconsMixin from '../mixins/icons'
import UtilsMixin from '../mixins/utils'
import MetadataMixin from '../mixins/metadata'

export default {
  name: 'DownloadList',
  props: ['mode', 'header', 'inputPlaceholder'],
  mixins: [IconsMixin, UtilsMixin, MetadataMixin],
  data () {
    return {
      filter: {},
      sort: 'title',
      filterPanelActive: false,
      sortPanelActive: false,
      page: 1,
      editPriorities: false
    }
  },
  components: {
    'mediaGrid': MediaGrid
  },
  computed: {
    items () {
      let items = this.$store.getters.itemsArray
      return items.filter(item => item !== null && item.priority !== null && item.priority > 0)
    }
  },
  methods: {
    handleScroll () {
      let d = document.documentElement
      let offset = d.scrollTop + window.innerHeight
      let height = d.offsetHeight

      if (offset >= height - 100) {
        this.page++
      }
    },
    resetFilters () {
      this.filter = JSON.parse(JSON.stringify(this.constants.LIST_FILTER_DEFAULT))
      this.sort = 'title'
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted () {
    let filter = JSON.parse(this.$localStorage.get('varda:list:filter'))
    if (filter) {
      filter.text = ''
      this.filter = filter
    } else {
      this.resetFilters()
    }

    let sort = this.$localStorage.get('varda:list:sort')
    if (sort) {
      this.sort = sort
    }
  },
  watch: {
    filter: {
      handler: function (newValue) {
        this.page = 1
        this.$localStorage.set('varda:list:filter', JSON.stringify(this.filter))
      },
      deep: true
    },
    sort: function (val, oldVal) {
      this.page = 1
      this.$localStorage.set('varda:list:sort', this.sort)
    },
    items: function (val, oldVal) {
      // disabled. might disorient the user
      // this.page = 1
    }
  },
  i18n: {
    messages: {
      de: {
        checklist: 'Download Liste',
        all: 'Alles',
        movie: 'Filme',
        tv: 'Serien',
        filter: 'Filter',
        priority: 'Priorität',
        edit: 'Editieren',
        sort: 'Sortierung',
        rating: 'Bewertung',
        title: 'Titel',
        popularity: 'Beliebtheit',
        release: 'Veröffentlichung',
        yes: 'Ja',
        no: 'Nein',
        none: 'Keine',
        search: 'Suchen',
        searchPlaceholder: 'Suchen…',
        reset: 'Filter zurücksetzen',
        status: 'Status'
      },
      en: {
        checklist: 'Download list',
        all: 'All',
        movie: 'Movies',
        tv: 'TV Shows',
        filter: 'Filter',
        priority: 'Priority',
        downloaded: 'Downloaded',
        edit: 'Edit',
        sort: 'Sort',
        rating: 'Rating',
        title: 'Title',
        popularity: 'Popularity',
        release: 'Release',
        yes: 'Yes',
        no: 'No',
        none: 'None',
        search: 'Search',
        searchPlaceholder: 'Search…',
        reset: 'Reset filters',
        status: 'Status'
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
.checklist-navigation {
  margin: 20px 20px 0 20px;
}
.checklist-navigation-item {
  opacity: 0.7;
  cursor: pointer;
  font-size: 20px;
  margin: 0 8px 0 8px;
}
.checklist-navigation-item:first-child {
  margin: 0 8px 0 1px;
}
.checklist-navigation-item:last-child {
  margin: 0 0 0 8px;
}
.checklist-navigation-item.active {
  opacity: 1;
}
.checklist-navigation-item:hover {
  opacity: 1;
}
.checklist-search-group {
  margin-top: 10px;
}
.checklist-search-clear:hover {
  color: darkred;
}
.checklist-navigation-colunn {
  padding: 0px;
}
.checklist-filter-panel{
  padding: 0;
}
.checklist-filter-row {
  margin-top: 10px;
}
.checklist-filter-label {
  padding: 0;
  margin-top: 5px;
}
.checklist-search-group {
  margin-top: 10px;
}
.checklist-search-clear:hover {
  color: darkred;
}
</style>
