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
              <item-information v-bind:item="item" v-bind:details="details" v-bind:mediaType="mediaType"></item-information>
            </b-col>
            <b-col cols="12" md="6" xl="4" id="actions" class="content-section">
              <item-actions v-bind:item="item" v-bind:details="details" v-bind:mediaType="mediaType"></item-actions>
              <item-links v-bind:item="item" v-bind:details="details" v-bind:mediaType="mediaType"></item-links>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" class="content-section">
              <h5>{{ $t('item.info') }}</h5>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="6" xl="8" id="overview" class="content-section">
              Cast Info...
            </b-col>
            <b-col cols="12" md="6" xl="4" id="actions" class="content-section">
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
import ItemLinks from './ItemLinks'

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
    'item-links': ItemLinks
  },
  computed: {
    key () {
      return this.mediaType + ':' + this.id
    },
    details () {
      let details = this.$store.getters.suggestionDetails
      return details
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
