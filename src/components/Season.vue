<template>
  <div class="season">
    <div v-if="details && season">
      <div id="content">
        <season-header v-bind:title="title" v-bind:backdrop="backdrop" v-bind:backdropPlaceholder="backdropPlaceholder" v-bind:shrink="shrink"></season-header>
        <season-poster v-bind:poster="poster" v-bind:placeholder="posterPlaceholder" v-bind:shrink="shrink"></season-poster>
        <!-- <season-edit v-bind:item="item" v-bind:details="details" v-bind:shrink="shrink" @edit="showEditDialog" @redownload="showEditDialog"></season-edit> -->
        <!-- <season-dialog v-bind:item="item" v-bind:details="details" v-bind:mediaType="mediaType"  @addComment="addComment" ref="dialog"></season-dialog> -->
        <b-container fluid class="content-container">
          <b-row>
            <b-col id="overview" cols="12" md="12" xl="12" class="content-section">
              <season-synopsis v-bind:season="season"></season-synopsis>
              <!-- <season-information v-bind:item="item" v-bind:details="details" v-bind:crew="crew" v-bind:mediaType="mediaType"></season-information> -->
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
    <!--
          <b-row>
            <b-col id="overview" cols="12" md="12" xl="12" class="content-section">
              <season-information v-bind:item="item" v-bind:details="details" v-bind:crew="crew" v-bind:mediaType="mediaType"></season-information>
              <season-synopsis v-bind:details="details"></season-synopsis>
            </b-col>
          </b-row>
          <b-row id="seasons" v-if="details.seasons">
            <b-col cols="12" md="12" xl="12" id="seasons" class="content-section">
              <season-seasons v-bind:item="item" v-bind:details="details" v-bind:includeSpecials="true"></season-seasons>
            </b-col>
          </b-row>
          <b-row>
            <b-col id="cast" cols="12" md="12" xl="12" class="content-section">
              <season-cast v-bind:cast="cast"></season-cast>
            </b-col>
          </b-row>
          <b-row id="comments">
            <b-col cols="12" md="12" xl="12" id="seasons" class="content-section">
              <season-comments v-bind:item="item"></season-comments>
            </b-col>
          </b-row>
    -->
  </div>
</template>

<script>
import SeasonHeader from './item/Header'
import SeasonPoster from './item/Poster'
import SeasonSynopsis from './season/Synopsis'
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
    'season-header': SeasonHeader,
    'season-poster': SeasonPoster,
    'season-synopsis': SeasonSynopsis,
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
    addComment () {
      window.scrollTo(0, document.body.scrollHeight)
      console.log('add comment')
    },
    showEditDialog () {
      this.$refs.dialog.show()
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
