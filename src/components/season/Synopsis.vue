<template>
  <div class="content">
    <div class="content"><span class="label">{{ $t('item.airDate')}}:&nbsp;</span>{{ date }}</div>
    <p>{{ season.overview }}</p>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils'

export default {
  name: 'Overview',
  props: ['season'],
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
          airDate: 'Erstausstrahlung'
        }
      },
      en: {
        item: {
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
