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
              <span class="checklist-navigation-item" @click="editModeActive = !editModeActive" v-bind:class="{ active: editModeActive }">
                <span class="d-none d-lg-inline">{{$t('edit') }}</span>
                <font-awesome-icon :icon="editIcon" class="checklist-navigation-icon"/>
              </span>
              <span class="checklist-navigation-item" @click="sortPanelActive = !sortPanelActive, filterPanelActive = false" v-bind:class="{ active: sortPanelActive }">
                <span class="d-none d-lg-inline">{{$t('sort') }}</span>
                <font-awesome-icon :icon="sortIcon" class="checklist-navigation-icon"/>
              </span>
              <span class="checklist-navigation-item" @click="filterPanelActive = !filterPanelActive, sortPanelActive = false" v-bind:class="{ active: filterPanelActive }">
                <span class="d-none d-lg-inline">{{$t('filter') }}</span>
                <font-awesome-icon :icon="filterIcon" class="checklist-navigation-icon"/>
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
                <b-button v-bind:class="{ 'btn-dark' : !filter.priority1}" @click="filter.priority1 = !filter.priority1" size="sm">{{ $t('priority1') }}</b-button>
                <b-button v-bind:class="{ 'btn-dark' : !filter.priority2}" @click="filter.priority2 = !filter.priority2" size="sm">{{ $t('priority2') }}</b-button>
                <b-button v-bind:class="{ 'btn-dark' : !filter.priority3}" @click="filter.priority3 = !filter.priority3" size="sm">{{ $t('priority3') }}</b-button>
              </b-button-group>
            </b-col>
          </b-row>
          <b-row class="checklist-filter-row">
            <b-col class="checklist-filter-items text-right">
              {{ $t('downloaded') }}
              <b-button-group>
                <b-button v-bind:class="{ 'btn-dark' : !filter.downloaded}" @click="filter.downloaded = !filter.downloaded" size="sm">{{ $t('yes') }}</b-button>
                <b-button v-bind:class="{ 'btn-dark' : !filter.notDownloaded}" @click="filter.notDownloaded = !filter.notDownloaded" size="sm">{{ $t('no') }}</b-button>
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
    </div>
    <div class="checklist-content">
      <mediaGrid
        v-bind:items="items"
        v-bind:filter="filter"
        v-bind:sort="sort"
        v-bind:showEditButton="true"
        editModeHandling="external"
        v-bind:editMode="editModeActive"
        v-bind:showPriorityControls="true"
        v-bind:showReDownloadControls="true"
        detailsRouterPrefix="list">
      </mediaGrid>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import searchIcon from '@fortawesome/fontawesome-free-solid/faSearch'
import crossIcon from '@fortawesome/fontawesome-free-solid/faTimes'
import filterIcon from '@fortawesome/fontawesome-free-solid/faFilter'
import sortIcon from '@fortawesome/fontawesome-free-solid/faSort'
import editIcon from '@fortawesome/fontawesome-free-solid/faEdit'
import priorityIcon from '@fortawesome/fontawesome-free-solid/faStar'

import MediaGrid from './MediaGrid'

export default {
  name: 'Browse',
  props: ['mode', 'header', 'inputPlaceholder'],
  data () {
    return {
      filter: {
        movie: true,
        tv: true,
        downloaded: true,
        notDownloaded: true,
        priority1: true,
        priority2: true,
        priority3: true,
        text: ''
      },
      sort: 'priority',
      editModeActive: false,
      filterPanelActive: false,
      sortPanelActive: false
    }
  },
  components: {
    FontAwesomeIcon,
    'mediaGrid': MediaGrid
  },
  computed: {
    items () {
      return this.$store.getters.itemsArray
    },
    searchIcon () {
      return searchIcon
    },
    crossIcon () {
      return crossIcon
    },
    filterIcon () {
      return filterIcon
    },
    sortIcon () {
      return sortIcon
    },
    editIcon () {
      return editIcon
    },
    priorityIcon () {
      return priorityIcon
    }
  },
  methods: {

  },
  created () {

  },
  beforeDestroy () {

  },
  watch: {
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
        priority1: 'Hoch',
        priority2: 'Mittel',
        priority3: 'Niedrig',
        downloaded: 'Heruntergeladen',
        sort: 'Sortierung',
        edit: 'Priorität Editieren',
        rating: 'Bewertung',
        title: 'Titel',
        popularity: 'Beliebtheit',
        release: 'Veröffentlichung',
        yes: 'Ja',
        no: 'Nein',
        none: 'Keine'
      },
      en: {
        checklist: 'Download list',
        all: 'All',
        movie: 'Movies',
        tv: 'TV Shows',
        filter: 'Filter',
        priority: 'Priority',
        priority1: 'High',
        priority2: 'Medium',
        priority3: 'Low',
        downloaded: 'Downloaded',
        sort: 'Sort',
        edit: 'Edit Priority',
        rating: 'Rating',
        title: 'Title',
        popularity: 'Popularity',
        release: 'Release',
        yes: 'Yes',
        no: 'No',
        none: 'None'
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
</style>
