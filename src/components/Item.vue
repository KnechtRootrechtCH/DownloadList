<template>
  <div class="item">
    <div v-if="details">
      <div id="content">
        <item-header v-bind:title="title" v-bind:backdrop="backdrop" v-bind:backdropPlaceholder="backdropPlaceholder" v-bind:shrink="shrink"></item-header>
        <item-poster v-bind:poster="poster" v-bind:placeholder="posterPlaceholder" v-bind:shrink="shrink"></item-poster>
        <item-edit v-bind:item="item" v-bind:details="details" v-bind:shrink="shrink" @edit="showEditDialog" @redownload="showEditDialog"></item-edit>
        <item-dialog v-bind:item="item" v-bind:details="details" v-bind:mediaType="mediaType"  @addComment="addComment" ref="dialog"></item-dialog>
        <b-container fluid class="content-container">
          <b-row>
            <b-col id="overview" cols="12" md="12" xl="12" class="content-section">
              <item-information v-bind:item="item" v-bind:details="details" v-bind:crew="crew" v-bind:mediaType="mediaType"></item-information>
              <item-synopsis v-bind:details="details"></item-synopsis>
            </b-col>
          </b-row>
          <b-row id="seasons" v-if="details.seasons">
            <b-col cols="12" md="12" xl="12" id="seasons" class="content-section">
              <item-seasons v-bind:item="item" v-bind:details="details" v-bind:includeSpecials="false"></item-seasons>
            </b-col>
          </b-row>
          <b-row>
            <b-col id="cast" cols="12" md="12" xl="12" class="content-section">
              <item-cast v-bind:cast="cast"></item-cast>
            </b-col>
          </b-row>
          <b-row id="comments">
            <b-col cols="12" md="12" xl="12" id="seasons" class="content-section">
              <item-comments v-bind:item="item"></item-comments>
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
import ItemComments from './item/Comments'
import UtilsMixin from '../mixins/utils'

export default {
  name: 'Item',
  props: ['id', 'mediaType'],
  mixins: [UtilsMixin],
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
    'item-comments': ItemComments
  },
  computed: {
    details () {
      let details = this.$store.getters.suggestionDetails
      return details
    },
    cast () {
      let cast = this.$store.getters.suggestionCast
      return cast
    },
    crew () {
      let crew = this.$store.getters.suggestionCrew
      return crew
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
      'media_type': this.mediaType,
      'id': this.id
    })
    this.$store.dispatch('getSuggestionCredits', {
      'media_type': this.mediaType,
      'id': this.id
    })
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
