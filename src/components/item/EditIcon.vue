<template>
  <div>
    <div class="actions" v-bind:style=" { top: calculatedPosition + 'px' } ">
      <font-awesome-icon
        v-if="isDownloaded"
        @click="redownload"
        :icon="icon('check')"
        class="icon limegreen"/>
      <font-awesome-icon
        v-if="!isDownloaded && isSelected"
        @click="edit"
        :icon="editIcon"
        v-bind:class="{ 'green': isDownloaded, 'skyblue' : isQueued, 'orange': isUnreleased, 'yellow': isNotYetAvailable || isHardToFind }"
        class="icon edit"/>
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
import TransactionsMixin from '../../mixins/transactions'

export default {
  name: 'EditIcon',
  props: ['details', 'isSelected', 'isDownloaded', 'isQueued', 'isHardToFind', 'isUnreleased', 'isNotYetAvailable', 'shrink'],
  mixins: [UtilsMixin, TransactionsMixin, IconsMixin],
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
    },
    editIcon () {
      if (this.isDownloaded) {
        return this.icon('check')
      } else if (this.isUnreleased) {
        return this.icon('calendar')
      } else if (this.isNotYetAvailable) {
        return this.icon('calendar')
      } else if (this.isQueued) {
        return this.icon('download')
      } else if (this.isHardToFind) {
        return this.icon('spinner')
      } else {
        return this.icon('clock')
      }
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
</style>
