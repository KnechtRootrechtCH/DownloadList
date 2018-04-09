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
                <p class="tagline" v-if="details.tagline">{{ details.tagline}}</p>
                <p>{{ details.overview}}</p>
              </div>
              <item-information class="d-none d-md-inline" v-bind:item="item" v-bind:details="details" v-bind:crew="crew" v-bind:mediaType="mediaType"></item-information>
            </b-col>
            <b-col cols="12" md="6" xl="4" id="actions" class="content-section">
              <item-actions v-bind:item="item" v-bind:details="details" v-bind:mediaType="mediaType"></item-actions>
            </b-col>
          </b-row>
          <b-row class="d-md-none">
            <b-col cols="12" md="12" xl="12" id="overview" class="content-section">
              <item-information v-bind:item="item" v-bind:details="details" v-bind:mediaType="mediaType"></item-information>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="12" xl="12" id="cast" class="content-section">
              <item-cast v-bind:cast="cast"></item-cast>
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
import ItemHeader from './ItemHeader'
import ItemInformation from './ItemInformation'
import ItemActions from './ItemActions'
import ItemCast from './ItemCast'

export default {
  name: 'Item',
  props: ['id', 'mediaType'],
  data () {
    return {
    }
  },
  components: {
    'item-header': ItemHeader,
    'item-information': ItemInformation,
    'item-actions': ItemActions,
    'item-cast': ItemCast
  },
  computed: {
    key () {
      return this.mediaType + ':' + this.id
    },
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
      var item = this.$store.getters.item(this.key)
      return item
    }
  },
  methods: {
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
          cast: 'Besetzung',
          originalTitle: 'Originaltitel'
        }
      },
      en: {
        item: {
          overview: 'Overview',
          info: 'Details',
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
</style>
