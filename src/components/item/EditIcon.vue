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
        :icon="icon('clock')"
        class="icon edit"/>
      <font-awesome-icon
        v-if="!isDownloaded && !isSelected"
        @click="add"
        :icon="icon('plus')"
        class="icon add"/>
    </div>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'EditIcon',
  props: ['details', 'isSelected', 'isDownloaded', 'shrink'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
      minPosition: 63,
      maxPosition: 190
    }
  },
  components: {
  },
  computed: {
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
  /*color: lightblue;*/
  cursor: pointer;
}
.actions .icon.add {
  /*color: lightblue;*/
  color: skyblue;
}
.actions .icon.downloaded {
  color: limegreen;
}
</style>
