<template>
  <b-list-group-item
    button
    class="item-action"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    v-bind:class="{ active : isActive, 'clickable' : isClickable }"
    v-bind:style="{ color : this.color, background : this.colorInverted, border : this.colorInverted }">
    <font-awesome-icon
      :icon="actionIcon"
      class="icon"
      v-bind:class="icon"/>
      <span class="label">{{ label.toUpperCase() }}</span>
  </b-list-group-item>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

import infoIcon from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import linkIcon from '@fortawesome/fontawesome-free-solid/faLink'
import globeIcon from '@fortawesome/fontawesome-free-solid/faGlobe'
import movieIcon from '@fortawesome/fontawesome-free-solid/faFilm'
import tvIcon from '@fortawesome/fontawesome-free-solid/faTv'
import addIcon from '@fortawesome/fontawesome-free-solid/faPlusCircle'
import removeIcon from '@fortawesome/fontawesome-free-solid/faMinusCircle'
import starIcon from '@fortawesome/fontawesome-free-solid/faStar'
import redownloadIcon from '@fortawesome/fontawesome-free-solid/faRedoAlt'
import downloadedIcon from '@fortawesome/fontawesome-free-solid/faCheckCircle'
import defaultIcon from '@fortawesome/fontawesome-free-solid/faCircle'

export default {
  name: 'ItemAction',
  props: ['label', 'icon', 'isActive', 'isClickable', 'colorVariant'],
  data () {
    return {
      hover: false
    }
  },
  components: {
    FontAwesomeIcon
  },
  computed: {
    actionIcon () {
      switch (this.icon) {
        case 'info': return infoIcon
        case 'link': return linkIcon
        case 'globe': return globeIcon
        case 'movie': return movieIcon
        case 'tv': return tvIcon
        case 'add': return addIcon
        case 'remove': return removeIcon
        case 'star': return starIcon
        case 'downloaded': return downloadedIcon
        case 'redownload': return redownloadIcon
        default: return defaultIcon
      }
    },
    color () {
      if (this.isActive || this.hover) {
        return '#f0f0f0'
      } else {
        return this.colorVariant
      }
    },
    colorInverted () {
      if (this.isActive || this.hover) {
        return this.colorVariant
      } else {
        return '#f0f0f0'
      }
    }
  }
}
</script>

<style scoped>
*:focus {
    outline: none;
}
.clickable {
  cursor: pointer;
}
.item-action {
  font-size: 18px;
}
.item-action .label {
  float: right;
}
.item-action .icon {
  width: 18px;
  height: 18px;
}
</style>
