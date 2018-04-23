<template>
  <div>
    <div class="actions" v-bind:style=" { top: calculatedPosition + 'px' } ">
      <font-awesome-icon
        v-if="isDownloaded"
        @click="redownload"
        :icon="icon('check')"
        class="icon downloaded fa-hover-hidden"/>
      <font-awesome-icon
        v-if="isDownloaded"
        @click="redownload"
        :icon="icon('redo')"
        class="icon fa-hover-show"/>
      <font-awesome-icon
        v-if="!isDownloaded && isSelected"
        @click="edit"
        :icon="icon('exclamation')"
        class="icon fa-hover-hidden"/>
      <font-awesome-icon
        v-if="!isDownloaded && isSelected"
        @click="edit"
        :icon="icon('check')"
        class="icon fa-hover-show"/>
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
  props: ['isSelected', 'isDownloaded', 'shrink'],
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
      this.$emit('add')
    },
    edit () {
      this.$emit('downloaded')
    },
    redownload () {
      this.$emit('redownload')
    }
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
* > .fa-hover-show,
.actions:hover .fa-hover-hidden {
  display: none;
}
.actions:hover .fa-hover-show {
  display: inline-block;
}

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
}

.actions .icon.downloaded {
 color: limegreen;
}
</style>
