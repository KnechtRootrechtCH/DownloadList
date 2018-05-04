<template>
  <div class="media-grid">
    <b-container fluid class="media-container">
      <transition-group name="media-grid" tag="div" class="row media-row">
        <b-col
        v-for="item in sortedItems" :key="item.id"
        cols="12" sm="12" md="4" lg="3" xl="3"
        class="media-item">
          <mediaCard
            v-bind:item="item"
            v-bind:mode="mode"
            v-bind:detailsRouterPrefix="detailsRouterPrefix">
          </mediaCard>
        </b-col>
      </transition-group>
    </b-container>
  </div>
</template>

<script>
import MediaCard from './MediaCard'
import MetadataMixin from '../mixins/metadata'
import UtilsMixin from '../mixins/utils'

export default {
  name: 'MediaGrid',
  mixins: [UtilsMixin, MetadataMixin],
  props: ['items', 'mode', 'sort', 'filter', 'detailsRouterPrefix'],
  data () {
    return {
    }
  },
  components: {
    'mediaCard': MediaCard
  },
  computed: {
    filteredItems () {
      if (this.filter) {
        let items = this.items.filter(this.filterItem)
        return items
      } else {
        return this.items
      }
    },
    sortedItems () {
      let filtered = this.filteredItems
      if (this.sort) {
        let items = filtered.sort(this.sortItem)
        return items
      } else {
        return filtered
      }
    }
  },
  methods: {
  },
  i18n: {
    messages: {
      de: {
      },
      en: {
      }
    }
  }
}
</script>

<style scoped>
.media-grid {
  margin: 0;
  padding: 10px;
}
.media-container {
  margin: 0;
  padding: 0;
}
.media-row {
  margin: 0;
  padding: 0;
}
.media-item {
  padding: 10px;
}
/* base */
.media-grid {
  backface-visibility: hidden;
  z-index: 1;
}
/* moving */
.media-grid-move {
  transition: all 600ms ease-in-out 50ms;
}
/* appearing */
.media-grid-enter-active {
  /* transition: all 400ms ease-out; */
  transition: opacity 200ms ease-in;
}
/* disappearing */
.media-grid-leave-active {
  transition: opacity 200ms ease-in;
  /*
  transition: all 200ms ease-in;
  position: absolute;
  z-index: 0;
  */
}
/* appear at / disappear to */
.media-grid-enter,
.media-grid-leave-to {
  opacity: 0;
}
</style>
