<template>
  <div>
    <div class="content">
      <h5 class="label">{{ $t('item.episodeList')}}</h5>
      <b-list-group>
        <item-season v-for="season in this.details.seasons" :key="season.id" v-bind:id="details.id" v-bind:item="item" v-bind:season="season"></item-season>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import ItemSeason from './Season'

export default {
  name: 'ItemSeasons',
  props: ['item', 'details'],
  data () {
    return {

    }
  },
  components: {
    'item-season': ItemSeason
  },
  computed: {
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
