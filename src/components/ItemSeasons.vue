<template>
  <div>
    <div class="content">
      <h5 class="label">{{ $t('item.episodeList')}}</h5>
      <b-list-group>
        <item-season v-for="season in filteredSeasons" :key="season.id" v-bind:item="item" v-bind:season="season"></item-season>
      </b-list-group>
      <!--
      <b-container fluid>
        <b-row v-for="season in filteredSeasons" :key="season.id" class="season-row">
          <item-season v-bind:item="item" v-bind:season="season"></item-season>
        </b-row>
      </b-container>
      -->
    </div>
  </div>
</template>

<script>
import ItemSeason from './ItemSeason'

export default {
  name: 'ItemSeasons',
  props: ['item', 'seasons'],
  data () {
    return {
      filterSpecials: true
    }
  },
  components: {
    'item-season': ItemSeason
  },
  computed: {
    filteredSeasons () {
      if (!this.filterSpecials) {
        return this.seasons
      }
      return this.seasons.filter(s => s.season_number > 0)
    }
  },
  methods: {

  },
  i18n: {
    messages: {
      de: {
        item: {
          episodeList: 'Episodenliste',
          seasons: 'Staffelns',
          season: {
            airDate: 'Ausstrahlung'
          }
        }
      },
      en: {
        item: {
          episodeList: 'Episode list',
          seasons: 'Seasons',
          season: {
            airDate: 'Air Date'
          }
        }
      }
    }
  }
}
</script>

<style scoped>
*:focus {
    outline: none;
}
.label {
  font-weight: bold;
}
</style>
