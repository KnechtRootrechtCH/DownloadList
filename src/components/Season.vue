<template>
  <div class="season">
    <div v-if="details && season">
      <div id="content">
        <season-header v-bind:title="title" v-bind:backdrop="backdrop" v-bind:backdropPlaceholder="backdropPlaceholder" v-bind:shrink="shrink"></season-header>
        <season-poster v-bind:poster="poster" v-bind:placeholder="posterPlaceholder" v-bind:shrink="shrink"></season-poster>
        <season-edit
          v-bind:item="item"
          v-bind:details="details"
          v-bind:isSelected="isSelected"
          v-bind:isDownloaded="isDownloaded"
          v-bind:shrink="shrink"
          @add="add"
          @downloaded="markDownloaded(true)"
          @redownload="markDownloaded(false)">
        </season-edit>
        <b-container fluid class="content-container">
          <b-row>
            <b-col id="overview" cols="12" md="12" xl="12" class="content-section">
              <season-synopsis v-bind:season="season" v-bind:isSelected="isSelected" v-bind:episodes="episodes" v-bind:downloaded="downloaded"></season-synopsis>
            </b-col>
          </b-row>
          <b-row>
            <b-col id="epsiodes" cols="12" md="12" xl="12" class="content-section">
              <episode-list v-bind:item="item" v-bind:season="season"></episode-list>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
    <div v-if="!details || !season">
    </div>
  </div>
</template>

<script>
import Header from './item/Header'
import Poster from './item/Poster'
import EditIcon from './season/EditIcon'
import Information from './season/Information'
import EpisodeList from './season/EpisodeList'
import UtilsMixin from '../mixins/utils'

export default {
  name: 'Season',
  props: ['id', 'seasonNumber'],
  mixins: [UtilsMixin],
  data () {
    return {
      shrink: 0,
      shrinkStart: 0,
      shrinkEnd: 150
    }
  },
  components: {
    'season-header': Header,
    'season-poster': Poster,
    'season-edit': EditIcon,
    'season-synopsis': Information,
    'episode-list': EpisodeList
  },
  computed: {
    details () {
      let details = this.$store.getters.suggestionDetails
      return details
    },
    item () {
      let item = this.$store.getters.item(this.details.key)
      return item
    },
    title () {
      return this.getTitle(this.details) + ' - ' + this.getTitle(this.season)
    },
    season () {
      let season = this.$store.getters.suggestionSeason(this.seasonNumber)
      return season
    },
    isSelected () {
      return this.item && this.item.priority > 0
    },
    isDownloaded () {
      return this.isSelected && this.downloadCount === this.episodeCount
    },
    downloaded () {
      if (!this.item) {
        return 0
      }
      return this.getEpisodeDownloadCount(this.item, this.seasonNumber)
    },
    episodes () {
      if (this.isSelected) {
        return this.season.episodes.length
      }
      return -1
    },
    poster () {
      return this.getPosterImage(this.season, this.constants.IMAGESIZE.POSTER.W185)
    },
    posterPlaceholder () {
      return this.getPosterPlaceholder(this.constants.IMAGESIZE.POSTER.W185)
    },
    backdrop () {
      return this.getBackdropImage(this.details, this.constants.IMAGESIZE.BACKDROP.W1400)
    },
    backdropPlaceholder () {
      return this.getBackdropPlaceholder(this.constants.IMAGESIZE.BACKDROP.W1400)
    }
  },
  methods: {
    add () {
      this.addItem(this.details)
    },
    markDownloaded (downloaded) {
      this.setSeasonDownloaded(this.item, this.season, downloaded)
    },
    handleScroll (event) {
      let scroll = document.documentElement.scrollTop
      let shrink = 0
      if (scroll >= this.shrinkStart) {
        scroll = scroll - this.shrinkStart
        let max = this.shrinkEnd - this.shrinkStart
        shrink = 100 / max * scroll
      }
      if (shrink > 100) {
        shrink = 100
      }
      this.shrink = shrink
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
    this.$store.dispatch('getSuggestionDetails', {
      'media_type': 'tv',
      'id': this.id
    })
    this.$store.dispatch('getSuggestionSeason', {
      'id': this.id,
      'season_number': this.seasonNumber
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  i18n: {
    messages: {
      de: {
        item: {
          overview: 'Handlung',
          info: 'Details',
          actions: 'Aktionen',
          cast: 'Besetzung',
          originalTitle: 'Originaltitel'
        }
      },
      en: {
        item: {
          overview: 'Overview',
          info: 'Details',
          actions: 'Actions',
          cast: 'Cast',
          originalTitle: 'Original title'
        }
      }
    }
  }
}
</script>

<style scoped>
.content-container {
  position: absolute;
  top: 300px;
}
.content-section {
  padding: 15px;
}
.poster-section {
  float: left;
}
</style>
