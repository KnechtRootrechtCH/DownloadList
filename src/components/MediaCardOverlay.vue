<template>
  <div class="overlay" v-bind:class="{ 'overlay-active' : editMode }">
    <div v-if="showPriorityControls" class="overlay-content">{{ $t('mediaCard.changepriority') }}</div>
    <div v-if="showPriorityControls" class="overlay-content">
        <font-awesome-icon
          v-for="p in priorities"
          :key="p"
          :icon="icon('star')"
          class="overlay-icon"
          v-bind:class="{ 'inactive': !hasPriority(p), 'highlight': hoverPriorityIcon(p) }"
          @click.stop="setPriority(item.key, p)" @mouseover="hoverPriority = p" @mouseout="hoverPriority = constants.PRIORITY.MIN + 1"/>
    </div>
    <div v-if="showReDownloadControls && !downloaded" class="overlay-content">{{ $t('mediaCard.markAsDownloaded') }}</div>
    <div v-if="showReDownloadControls && !downloaded" class="overlay-content">
      <font-awesome-icon
        :icon="icon('check')"
        class="card-icon overlay-icon"
        @click.stop="setDownloaded(item, true)"/>
    </div>
    <div v-if="showReDownloadControls && downloaded" class="overlay-content">{{ $t('mediaCard.redownload') }}</div>
    <div v-if="showReDownloadControls && downloaded" class="overlay-content">
      <font-awesome-icon
        :icon="icon('redo')"
        class="card-icon overlay-icon"
        @click.stop="setDownloaded(item, false)"/>
    </div>
  </div>
</template>

<script>
import UtilsMixin from '../mixins/utils'
import IconsMixin from '../mixins/icons'

export default {
  name: 'MediaCardEditOverlay',
  props: ['item', 'editMode', 'showPriorityControls', 'showReDownloadControls'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
      hoverPriority: 100
    }
  },
  components: {
  },
  computed: {
    priority () {
      let selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        return selectedItem.priority
      } else {
        return this.constants.PRIORITY.NONE
      }
    },
    downloaded () {
      let selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        return selectedItem.downloaded
      }
      return false
    },
    selectedItem () {
      let selectedItem = this.$store.getters.item(this.item.key)
      return selectedItem
    }
  },
  methods: {
    hasPriority (priority) {
      let selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        return selectedItem.priority <= priority
      }
      return false
    },
    hoverPriorityIcon (priority) {
      return priority >= this.hoverPriority
    }
  },
  i18n: {
    messages: {
      de: {
        mediaCard: {
          changepriority: 'Priorität',
          redownload: 'Erneut Herunterladen',
          markAsDownloaded: 'Als heruntergeladen markieren'
        }
      },
      en: {
        mediaCard: {
          changepriority: 'Priority',
          redownload: 'Mark for Re-Download',
          markAsDownloaded: 'Mark as downloaded'
        }
      }
    }
  }
}
</script>

<style scoped>
*:focus {
    outline: none;
}
.overlay {
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: -1;
}
.overlay-active {
  opacity: 1;
  z-index: 2;
  padding: 5px;
}
.overlay-content {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: white;
}
.overlay-icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
  color: white;
}
.overlay-icon.inactive {
  opacity: 0.5;
}
.overlay-icon.inactive.highlight {
  opacity: 1;
}
.overlay-icon.highlight {
  opacity: 1;
}
</style>
