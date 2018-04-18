<template>
  <div>
      <div class="actions" v-bind:style=" { top: calculatedPosition + 'px' } ">
        <font-awesome-icon
          v-if="isDownloaded"
          :icon="icon('check')"
          class="icon downloaded"/>
        <font-awesome-icon
          v-if="!isDownloaded && isSelected"
          :icon="icon('edit')"
          class="icon"/>
        <font-awesome-icon
          v-if="!isDownloaded && !isSelected"
          @click="add"
          :icon="icon('plus')"
          class="icon"/>
      </div>
    </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'Edit',
  props: ['details', 'item', 'vOffset'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
      minPosition: 85,
      maxPosition: 185
    }
  },
  components: {
  },
  computed: {
    isSelected () {
      return this.item && this.item.priority > 0
    },
    isDownloaded () {
      if (this.item) {
        return this.item.downloaded
      }
      return false
    },
    calculatedPosition () {
      let position = this.maxPosition - this.minPosition
      position = position / 100 * (100 - this.vOffset)
      position = position + this.minPosition
      return position
    }
  },
  methods: {
    add () {
      this.addItem(this.details)
    }
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
.actions {
  position: fixed;
  right: 15px;
  z-index: 222;
  -webkit-transition: all .2s ease-in-out;
  -moz-transition: all .2s ease-in-out;
  -o-transition: all .2s ease-in-out;
  -ms-transition: all .2s ease-in-out;
  transition: all .2s ease-in-out;
}
.actions .icon {
  width: 40px;
  height: 40px;
  float: right;
  color: skyblue;
  -webkit-transition: all .2s ease-in-out;
  -moz-transition: all .2s ease-in-out;
  -o-transition: all .2s ease-in-out;
  -ms-transition: all .2s ease-in-out;
  transition: all .2s ease-in-out;
}

.actions .icon.downloaded {
  color: limegreen;
}
</style>
