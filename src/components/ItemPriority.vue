<template>
  <b-list-group-item
    button
    class="item-action"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="increase()"
    v-bind:class="{ active : isActive }"
    v-bind:style="{ color : this.color, background : this.colorInverted, border : this.colorInverted }">
    <font-awesome-icon
      :icon="actionIcon"
      class="icon clickable"
      v-bind:class="[{ 'highlighted' : has(3) }, icon]"
      @click.stop="set(3)" @mouseover="priority = 3" @mouseout="priority = 4"/>
    <font-awesome-icon
      :icon="actionIcon"
      class="icon clickable"
      v-bind:class="[{ 'highlighted' : has(2) }, icon]"
      @click.stop="set(2)" @mouseover="priority = 2" @mouseout="priority = 3"/>
    <font-awesome-icon
      :icon="actionIcon"
      class="icon clickable"
      v-bind:class="[{ 'highlighted' : has(1) }, icon]"
      @click.stop="set(1)" @mouseover="priority = 1" @mouseout="priority = 2"/>
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
  name: 'ItemPriority',
  props: ['itemKey', 'current', 'min', 'label', 'icon', 'isActive', 'colorVariant'],
  data () {
    return {
      hover: false,
      priority: 10
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
  },
  methods: {
    has (priority) {
      return this.current <= priority || this.priority <= priority
    },
    set (priority) {
      this.$store.dispatch('setItemPriority', {
        key: this.itemKey,
        priority: priority})
    },
    increase () {
      let priority = this.current - 1
      if (priority === 0) {
        priority = this.min
      }
      this.set(priority)
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
.label {
  float: right;
}
.icon {
  width: 18px;
  height: 18px;
  opacity: 0.2;
}
.highlighted {
  opacity: 1;
}
</style>
