<template>
  <div class="overlay" v-bind:class="{ 'overlay-active' : editMode }">
    <div class="overlay-content">{{ $t('mediaCard.changepriority') }}</div>
    <div class="overlay-content">
        <font-awesome-icon
          v-if="showPriorityControls"
          :icon="priorityIcon"
          class="overlay-icon"
          v-bind:class="{ 'inactive': !hasPriority(3), 'highlight': hoverPriorityIcon(3) }"
          @click.stop="setPriority(3)" @mouseover="hoverPriority = 3" @mouseout="hoverPriority = 4"
          v-bind:title="$t('mediaCard.tooltip.priority3')"/>
        <font-awesome-icon
          v-if="showPriorityControls"
          :icon="priorityIcon"
          class="overlay-icon"
          v-bind:class="{ 'inactive': !hasPriority(2), 'highlight': hoverPriorityIcon(2) }"
          @click.stop="setPriority(2)" @mouseover="hoverPriority = 2" @mouseout="hoverPriority = 4"
          v-bind:title="$t('mediaCard.tooltip.priority2')"/>
        <font-awesome-icon
          v-if="showPriorityControls"
          :icon="priorityIcon"
          class="overlay-icon"
          v-bind:class="{ 'inactive': !hasPriority(1), 'highlight': hoverPriorityIcon(1) }"
          @click.stop="setPriority(1)" @mouseover="hoverPriority = 1" @mouseout="hoverPriority = 4"
          v-bind:title="$t('mediaCard.tooltip.priority1')"/>
    </div>
    <div v-if="showReDownloadControls && !downloaded" class="overlay-content">{{ $t('mediaCard.markAsDownloaded') }}</div>
    <div v-if="showReDownloadControls && !downloaded" class="overlay-content">
      <font-awesome-icon
        :icon="downloadedIcon"
        class="card-icon overlay-icon"
        @click.stop="setDownloaded(true)"
        v-bind:title="$t('mediaCard.markAsDownloaded')"/>
    </div>
    <div v-if="showReDownloadControls && downloaded" class="overlay-content">{{ $t('mediaCard.redownload') }}</div>
    <div v-if="showReDownloadControls && downloaded" class="overlay-content">
      <font-awesome-icon
        :icon="redownloadIcon"
        class="card-icon overlay-icon"
        @click.stop="setDownloaded(false)"
        v-bind:title="$t('mediaCard.redownload')"/>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

import priorityIcon from '@fortawesome/fontawesome-free-solid/faStar'
import redownloadIcon from '@fortawesome/fontawesome-free-solid/faRedoAlt'
import downloadedIcon from '@fortawesome/fontawesome-free-solid/faCheckCircle'

export default {
  name: 'MediaCardEditOverlay',
  props: ['item', 'editMode', 'showPriorityControls', 'showReDownloadControls'],
  data () {
    return {
      lowestPriority: 3,
      defaultPriority: 2,
      hoverPriority: 10
    }
  },
  components: {
    FontAwesomeIcon
  },
  computed: {
    priority () {
      let selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        return selectedItem.priority
      } else {
        return 0
      }
    },
    downloadedIcon () {
      return downloadedIcon
    },
    priorityIcon () {
      return priorityIcon
    },
    redownloadIcon () {
      return redownloadIcon
    },
    downloaded () {
      let selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        return selectedItem.downloaded
      }
      return false
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
    setPriority (priority) {
      this.destroyTooltips()

      let selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        this.$store.dispatch('setItemPriority', {
          key: selectedItem.key,
          priority: priority})
      } else {
        this.item.priority = priority
        this.$store.dispatch('addItem', this.item)
      }
    },
    setDownloaded (downloaded) {
      this.destroyTooltips()

      let selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        this.$store.dispatch('setItemDownloaded', {
          key: selectedItem.key,
          downloaded: downloaded})
      }
    },
    hoverPriorityIcon (priority) {
      return priority >= this.hoverPriority
    },
    destroyTooltips () {
      // quite a hack, but works
      let tooltips = document.getElementsByClassName('tooltip')
      for (let i = tooltips.length - 1; i >= 0; i--) {
        // Remove first element (at [0]) repeatedly
        tooltips[0].parentNode.removeChild(tooltips[0])
      }
    }
  },
  i18n: {
    messages: {
      de: {
        mediaCard: {
          tooltip: {
            priority3: 'Tief',
            priority2: 'Mittel',
            priority1: 'Hoch'
          },
          changepriority: 'Priorität',
          redownload: 'Erneut Herunterladen',
          markAsDownloaded: 'Als heruntergeladen markieren'
        }
      },
      en: {
        mediaCard: {
          tooltip: {
            priority3: 'Low',
            priority2: 'Medium',
            priority1: 'High'
          },
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
