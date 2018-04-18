<template>
  <div class="item">
    <div v-if="details">
      <div id="content">
        <item-header v-bind:item="item" v-bind:details="details" v-bind:shrink="headerShrink"></item-header>
        <b-container fluid class="content-container">
          <b-row>
            <b-col cols="12" md="12" xl="12" id="overview" class="content-section">
              <item-information v-bind:item="item" v-bind:details="details" v-bind:crew="crew" v-bind:mediaType="mediaType"></item-information>
              <item-synopsis v-bind:details="details"></item-synopsis>
            </b-col>
            <b-col cols="12" md="12" xl="12" id="actions" class="content-section">
              <item-edit v-bind:item="item" v-bind:details="details" v-bind:vOffset="headerShrink"></item-edit>
              <!--<item-actions v-bind:item="item" v-bind:details="details" v-bind:mediaType="mediaType" @addComment="addComment"></item-actions>-->
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="12" xl="12" id="cast" class="content-section">
              <item-cast v-bind:cast="cast"></item-cast>
            </b-col>
          </b-row>
          <b-row v-if="details.seasons">
            <b-col cols="12" md="12" xl="12" id="seasons" class="content-section">
              <item-seasons v-bind:item="item" v-bind:details="details"></item-seasons>
            </b-col>
          </b-row>
          <b-row>
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
import ItemEdit from './item/Edit'
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
      headerShrink: 0,
      shrinkStart: 0,
      shrinkEnd: 150
    }
  },
  components: {
    'item-header': ItemHeader,
    'item-poster': ItemPoster,
    'item-edit': ItemEdit,
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
      let item = this.$store.getters.item(this.details.key)
      return item
    }
  },
  methods: {
    addComment () {
      window.scrollTo(0, document.body.scrollHeight)
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
      this.headerShrink = shrink
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
  top: 200px;
}
.content-section {
  padding: 15px;
}
.poster-section {
  float: left;
}
</style>
