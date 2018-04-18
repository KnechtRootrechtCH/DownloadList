<template>
  <div class="poster-section">
    <progressive-img class="poster-small d-md-none" v-bind:src="poster" v-bind:fallback="posterPlaceholder" :blur="10"></progressive-img>
    <progressive-img class="poster-big d-none d-md-block" v-bind:src="poster" v-bind:fallback="posterPlaceholder" :blur="10"></progressive-img>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils'

export default {
  name: 'Poster',
  props: ['details'],
  mixins: [UtilsMixin],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    poster () {
      return this.getPosterImage(this.details, this.constants.IMAGESIZE.POSTER.W185)
    },
    posterPlaceholder () {
      return this.getPosterPlaceholder(this.constants.IMAGESIZE.POSTER.W185)
    }
  },
  methods: {
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
.poster-small {
  width: 130px;
  margin: 0 15px 15px 0;
  border-color: #d0d0d0;
  border-style: solid;
}
.poster-big {
  width: 160px;
  margin: 0 15px 15px 0;
  border-color: #d0d0d0;
  border-style: solid;
}
</style>
