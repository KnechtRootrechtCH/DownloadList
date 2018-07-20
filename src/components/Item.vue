<template>
  <div class="item">
    <div v-if="details">
      <div id="content">
        <item-header v-bind:title="title" v-bind:backdrop="backdrop" v-bind:backdropPlaceholder="backdropPlaceholder" v-bind:shrink="shrink"></item-header>
        <item-poster v-bind:poster="poster" v-bind:placeholder="posterPlaceholder" v-bind:shrink="shrink"></item-poster>
        <item-edit
          v-bind:details="details"
          v-bind:isSelected="isSelected"
          v-bind:isDownloaded="itemIsDownloaded(item)"
          v-bind:isQueued="itemIsQueued(item)"
          v-bind:isHardToFind="itemIsHardToFind(item)"
          v-bind:isNotYetAvailable="itemIsNotYetAvailable(item)"
          v-bind:isUnreleased="itemIsUnreleased(item)"
          v-bind:shrink="shrink"
          @edit="showEditDialog"
          @redownload="showEditDialog">
        </item-edit>
        <item-dialog
          ref="dialog"
          v-bind:item="item"
          v-bind:details="details"
          v-bind:seasons="seasons"
          v-bind:mediaType="mediaType"
          v-bind:isSelected="isSelected"
          v-bind:isDownloaded="itemIsDownloaded(item)"
          v-bind:isQueued="itemIsQueued(item)"
          v-bind:isHardToFind="itemIsHardToFind(item)"
          v-bind:isNotYetAvailable="itemIsNotYetAvailable(item)"
          v-bind:isUnreleased="itemIsUnreleased(item)"
          v-bind:totalDownloadedCount="totalDownloadedCount"
          v-bind:totalEpisodeCount="totalEpisodeCount"
          @addComment="addComment">
        </item-dialog>
        <b-container fluid class="content-container">
          <b-row>
            <b-col id="overview" cols="12" md="12" xl="12" class="content-section">
              <item-information
                v-bind:item="item"
                v-bind:details="details"
                v-bind:crew="crew"
                v-bind:mediaType="mediaType"
                v-bind:totalDownloadedCount="totalDownloadedCount"
                v-bind:totalEpisodeCount="totalEpisodeCount"
                v-bind:isDownloaded="itemIsDownloaded(item)"
                v-bind:isQueued="itemIsQueued(item)"
                v-bind:isHardToFind="itemIsHardToFind(item)"
                v-bind:isNotYetAvailable="itemIsNotYetAvailable(item)"
                v-bind:isUnreleased="itemIsUnreleased(item)"
                @toggleDownloaded="toggleDownloadedState"></item-information>
              <item-synopsis v-bind:details="details"></item-synopsis>
            </b-col>
          </b-row>
          <b-row id="seasons" v-if="details.seasons">
            <b-col cols="12" md="12" xl="12" id="seasons" class="content-section">
              <item-seasons v-bind:id="id" v-bind:item="item" v-bind:seasons="seasons"></item-seasons>
            </b-col>
          </b-row>
          <b-row>
            <b-col id="cast" cols="12" md="12" xl="12" class="content-section">
              <item-cast v-bind:cast="cast"></item-cast>
            </b-col>
          </b-row>
          <b-row>
            <b-col id="recommendations" cols="12" md="12" xl="12" class="content-section">
              <item-recommendations v-bind:recommendations="recommendations" v-bind:mediaType="mediaType"></item-recommendations>
            </b-col>
          </b-row>
          <b-row id="comments">
            <b-col cols="12" md="12" xl="12" id="seasons" class="content-section">
              <item-comments v-bind:itemKey="itemKey"></item-comments>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
    <div v-if="!details">
      <!-- TODO: handle load fail -->
    </div>
  </div>
</template>

<script>
import ItemHeader from './item/Header'
import ItemPoster from './item/Poster'
import ItemEditIcon from './item/EditIcon'
import ItemEditDialog from './item/EditDialog'
import ItemInformation from './item/Information'
import ItemSynopsis from './item/Synopsis'
import ItemActions from './item/Actions'
import ItemCast from './item/Cast'
import ItemSeasons from './item/Seasons'
import ItemRecommendations from './item/Recommendations'
import ItemComments from './item/Comments'
import UtilsMixin from '../mixins/utils'
import ImagesMixin from '../mixins/images'
import MetadataMixin from '../mixins/metadata'
import TvShowsMixin from '../mixins/tv'
import TransactionsMixin from '../mixins/transactions'

export default {
  name: 'Item',
  props: ['id', 'mediaType'],
  mixins: [UtilsMixin, ImagesMixin, MetadataMixin, TvShowsMixin, TransactionsMixin],
  data () {
    return {
      commentsEditMode: false,
      shrink: 0,
      shrinkStart: 0,
      shrinkEnd: 150
    }
  },
  components: {
    'item-header': ItemHeader,
    'item-poster': ItemPoster,
    'item-edit': ItemEditIcon,
    'item-dialog': ItemEditDialog,
    'item-information': ItemInformation,
    'item-synopsis': ItemSynopsis,
    'item-actions': ItemActions,
    'item-cast': ItemCast,
    'item-seasons': ItemSeasons,
    'item-recommendations': ItemRecommendations,
    'item-comments': ItemComments
  },
  watch: {
    id (oldId, newId) {
      this.loadDetails()
    },
    mediaType (oldMediaType, newMediaType) {
      this.loadDetails()
    }
  },
  computed: {
    itemKey () {
      return this.mediaType + ':' + this.id
    },
    details () {
      let details = this.$store.getters.suggestionDetails
      return details
    },
    cast () {
      if (!this.details.credits) {
        return null
      }
      let cast = this.details.credits.cast
      return cast
    },
    crew () {
      if (!this.details.credits) {
        return null
      }
      let crew = this.details.credits.crew
      return crew
    },
    recommendations () {
      let recommendations = this.details.recommendations
      if (recommendations) {
        return recommendations.results
      } else {
        return null
      }
    },
    item () {
      let item = this.$store.getters.item(this.mediaType + ':' + this.id)
      return item
    },
    title () {
      return this.getTitle(this.details)
    },
    poster () {
      return this.getPosterImage(this.details, this.constants.IMAGESIZE.POSTER.W185)
    },
    posterPlaceholder () {
      return this.getPosterPlaceholder(this.constants.IMAGESIZE.POSTER.W185)
    },
    backdrop () {
      return this.getBackdropImage(this.details, this.constants.IMAGESIZE.BACKDROP.W1400)
    },
    backdropPlaceholder () {
      return this.getBackdropPlaceholder(this.constants.IMAGESIZE.BACKDROP.W1400)
    },
    isSelected () {
      return this.item && this.item.priority > 0
    },
    totalDownloadedCount () {
      let count = 0
      if (this.isTv(this.item)) {
        let seasons = this.seasons
        if (seasons !== null) {
          this.seasons.forEach(season => {
            count += this.getEpisodeDownloadCount(this.item, season.season_number)
          })
        }
      }
      return count
    },
    totalEpisodeCount () {
      let count = 0
      if (this.isTv(this.item)) {
        let seasons = this.seasons
        if (seasons !== null) {
          this.seasons.forEach(season => {
            count += this.getEpisodeCount(season)
          })
        }
      }
      return count
    },
    seasons () {
      if (!this.isTv(this.details)) {
        return null
      }
      return this.filterSeasons(this.details.seasons, this.settings.includeSpecials)
    }
  },
  methods: {
    loadDetails () {
      this.$store.dispatch('getSuggestionDetails', {
        'media_type': this.mediaType,
        'id': this.id
      })
    },
    addComment () {
      window.scrollTo(0, document.body.scrollHeight)
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
    },
    toggleDownloadedState () {
      if (!this.isTv(this.item)) {
        this.setDownloaded(this.item, !this.itemIsDownloaded(this.item), this.seasons)
        return
      }
      let isDownloaded = this.totalDownloadedCount === this.totalEpisodeCount

      this.setAllSeasonsDownloaded(this.item, this.seasons, !isDownloaded)
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
    this.loadDetails()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  i18n: {
    messages: {
      de: {
        item: {
        }
      },
      en: {
        item: {
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
