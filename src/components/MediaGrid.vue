<template>
  <div class="media-grid">
    <b-container fluid class="media-container">
      <transition-group name="media-grid" tag="div" class="row media-row">
        <b-col
        v-for="item in sortedItems" :key="item.id"
        cols="12" sm="12" md="4" lg="3" xl="3"
        class="media-item">
          <mediaCard
            v-bind:item="item"
            v-bind:showEditButton="showEditButton"
            v-bind:editModeHandling="editModeHandling"
            v-bind:editMode="editMode"
            v-bind:showPriorityControls="showPriorityControls"
            v-bind:showReDownloadControls="showReDownloadControls"
            v-bind:detailsRouterPrefix="detailsRouterPrefix">
          </mediaCard>
        </b-col>
      </transition-group>
    </b-container>
  </div>
</template>

<script>
import MediaCard from './MediaCard'
import MetadataMixin from '../mixins/metadata'
import TvShowsMixin from '../mixins/tv'
import UtilsMixin from '../mixins/utils'

export default {
  name: 'MediaGrid',
  mixins: [UtilsMixin, MetadataMixin, TvShowsMixin],
  props: ['items',
    'sort',
    'filter',
    'showEditButton',
    'editModeHandling',
    'editMode',
    'showPriorityControls',
    'showReDownloadControls',
    'detailsRouterPrefix'],
  data () {
    return {
    }
  },
  components: {
    'mediaCard': MediaCard
  },
  computed: {
    filteredItems () {
      if (this.filter) {
        return this.items.filter(this.filterItem)
      } else {
        return this.items
      }
    },
    sortedItems () {
      let filtered = this.filteredItems
      if (this.sort) {
        return filtered.sort(this.sortItems)
      } else {
        return filtered
      }
    }
  },
  methods: {
    filterItem (item) {
      if (this.filter === null) {
        return true
      }
      if (!this.filter.movie && this.isMovie(item)) {
        return false
      }
      if (!this.filter.tv && this.isTv(item)) {
        return false
      }

      let selectedItem = this.$store.getters.item(item.key)

      if (!this.filter.downloaded) {
        if (selectedItem && selectedItem.downloaded) {
          return false
        }
      }

      if (!this.filter.notDownloaded) {
        if (!selectedItem || !selectedItem.downloaded) {
          return false
        }
      }

      switch (selectedItem.priority) {
        case 1:
          if (!this.filter.priority1) return false
          break
        case 2:
          if (!this.filter.priority2) return false
          break
        case 3:
          if (!this.filter.priority3) return false
          break
      }

      if (this.filter.string && this.filter.string.length > 2) {
        let title = this.getTitle(item)
        return title.toLowerCase().includes(this.searchString.toLowerCase())
      }
      return true
    },
    sortItems (a, b) {
      if (this.sort === 'priority') {
        if (this.isDownloaded(a)) return 1
        if (this.isDownloaded(b)) return -1
        if (a.priority - b.priority !== 0) return a.priority - b.priority
      }
      if (this.sort === 'release') {
        let releaseA = this.getReleaseDateMoment(a)
        let releaseB = this.getReleaseDateMoment(b)
        if (releaseB - releaseA !== 0) return releaseB - releaseA
      }
      if (this.sort === 'rating') {
        if (a.vote_average < b.vote_average) return 1
        if (a.vote_average > b.vote_average) return -1
        return 0
      }
      if (this.sort === 'popularity') {
        if (a.popularity < b.popularity) return 1
        if (a.popularity > b.popularity) return -1
        return 0
      }

      let titleA = this.getTitle(a)
      let titleB = this.getTitle(b)
      if (titleA > titleB) return 1
      if (titleA < titleB) return -1
      return 0
    },
    isDownloaded (item) {
      if (!item.priority > 0) {
        return false
      }
      if (this.isTv(item) && item.seasons) {
        let seasons = this.filterSeasons(item.seasons, this.settings.includeSpecials)
        let totalDownloadedCount = this.totalDownloadedCount(item, seasons)
        let totalEpisodeCount = this.totalEpisodeCount(item, seasons)
        return totalDownloadedCount > 0 && totalDownloadedCount === totalEpisodeCount
      } else {
        return item.downloaded
      }
    },
    totalDownloadedCount (item, seasons) {
      let count = 0
      if (seasons !== null) {
        seasons.forEach(season => {
          count += this.getEpisodeDownloadCount(item, season.season_number)
        })
      }
      return count
    },
    totalEpisodeCount (item, seasons) {
      let count = 0
      if (seasons !== null) {
        seasons.forEach(season => {
          count += this.getEpisodeCount(season)
        })
      }
      return count
    }
  },
  i18n: {
    messages: {
      de: {
      },
      en: {
      }
    }
  }
}
</script>

<style scoped>
.media-grid {
  margin: 0;
  padding: 10px;
}
.media-container {
  margin: 0;
  padding: 0;
}
.media-row {
  margin: 0;
  padding: 0;
}
.media-item {
  padding: 10px;
}
/* base */
.media-grid {
  backface-visibility: hidden;
  z-index: 1;
}
/* moving */
.media-grid-move {
  transition: all 600ms ease-in-out 50ms;
}
/* appearing */
.media-grid-enter-active {
  /* transition: all 400ms ease-out; */
  transition: opacity 200ms ease-in;
}
/* disappearing */
.media-grid-leave-active {
  transition: opacity 200ms ease-in;
  /*
  transition: all 200ms ease-in;
  position: absolute;
  z-index: 0;
  */
}
/* appear at / disappear to */
.media-grid-enter,
.media-grid-leave-to {
  opacity: 0;
}
</style>
