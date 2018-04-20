<template>
  <div class="content">
    <p class="tagline" v-if="details.tagline">{{ details.tagline}}</p>
    <p>{{ details.overview}}</p>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils'

export default {
  name: 'Overview',
  props: ['details'],
  mixins: [UtilsMixin],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
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
.content {
  margin-bottom: 10px;
}
.tagline {
  font-style: italic;
}
</style>
