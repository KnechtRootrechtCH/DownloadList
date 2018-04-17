<template>
  <div class="item">
    <div v-if="details">
      <div id="content">
        <div id= "header" class="header-section">
          <item-header v-bind:item="item" v-bind:details="details" v-bind:mediaType="mediaType"></item-header>
        </div>
        <b-container fluid>
          <b-row>
            <b-col cols="12" md="6" xl="8" id="overview" class="content-section">
              <div class="content">
                <p class="tagline d-md-none" v-if="details.tagline">{{ details.tagline}}</p>
                <p>{{ details.overview}}</p>
              </div>
              <item-information class="" v-bind:item="item" v-bind:details="details" v-bind:crew="crew" v-bind:mediaType="mediaType"></item-information>
            </b-col>
            <b-col cols="12" md="6" xl="4" id="actions" class="content-section">
              <!--<h5 class="label d-md-none">{{ $t('item.actions')}}</h5>-->
              <item-actions v-bind:item="item" v-bind:details="details" v-bind:mediaType="mediaType" @addComment="addComment"></item-actions>
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
import ItemInformation from './item/Information'
import ItemActions from './item/Actions'
import ItemCast from './item/Cast'
import ItemSeasons from './item/Seasons'
import ItemComments from './item/Comments'

export default {
  name: 'Item',
  props: ['id', 'mediaType'],
  data () {
    return {
      commentsEditMode: false
    }
  },
  components: {
    'item-header': ItemHeader,
    'item-information': ItemInformation,
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
    }
  },
  created () {
    this.$store.dispatch('getSuggestionDetails', {
      'media_type': this.mediaType,
      'id': this.id
    })
    this.$store.dispatch('getSuggestionCredits', {
      'media_type': this.mediaType,
      'id': this.id
    })
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
.header-section {
  height: 300px;
}
.content-section {
  padding: 15px;
}
.spacer {
  margin-top: 15px;
}
.tagline {
  font-style: italic;
  font-weight: bold;
}
</style>
