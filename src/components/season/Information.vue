<template>
  <div class="content">
    <div class="content" v-if="episodeCount > 0"><span class="label">{{ $t('item.downloaded')}}:&nbsp;</span>{{ downloadCount }}&nbsp;/&nbsp;{{ episodeCount }}</div>
    <div class="content"><span class="label">{{ $t('item.airDate')}}:&nbsp;</span>{{ date }}</div>
    <p>{{ season.overview }}</p>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils'

export default {
  name: 'Overview',
  props: ['season', 'episodeCount', 'downloadCount'],
  mixins: [UtilsMixin],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    year () {
      return this.getReleaseDateFormated(this.season, 'YYYY')
    },
    date () {
      return this.getReleaseDateFormated(this.season, 'DD.MM.YYYY')
    }
  },
  methods: {
  },
  i18n: {
    messages: {
      de: {
        item: {
          downloaded: 'Heruntergeladen',
          airDate: 'Erstausstrahlung'
        }
      },
      en: {
        item: {
          downloaded: 'Downloaded',
          airDate: 'Air date'
        }
      }
    }
  }
}
</script>

<style scoped>
.label {
  font-weight: bold;
  /* text-transform: uppercase; */
}
</style>
