<template>
  <div>
    <div class="actions" v-bind:style=" { top: calculatedPosition + 'px' } ">
      <font-awesome-icon
        v-if="isDownloaded"
        @click="redownload"
        :icon="icon('check')"
        class="icon downloaded"/>
      <font-awesome-icon
        v-if="!isDownloaded && isSelected"
        @click="edit"
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
  props: ['details', 'item', 'shrink'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
      minPosition: 65,
      maxPosition: 190
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
      position = position / 100 * (100 - this.shrink)
      position = position + this.minPosition
      return position
    }
  },
  methods: {
    add () {
      this.addItem(this.details)
      this.$emit('edit')
    },
    edit () {
      this.$emit('edit')
    },
    redownload () {
      this.$emit('redownload')
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
  opacity: 1;
}
.actions .icon {
  width: 40px;
  height: 40px;
  float: right;
  /*color: skyblue;*/
  color: lightblue;
  }

.actions .icon.downloaded {
  /*color: limegreen;*/
  color: lightblue;
}
</style>
