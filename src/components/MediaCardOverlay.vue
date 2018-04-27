<template>
  <div class="overlay" v-bind:class="{ 'overlay-active' : editMode }">
    <b-list-group class="actions">
      <b-list-group-item
        button
        @click.stop="incrementPriority()"
        class="action button-blue">
        <font-awesome-icon
          v-for="p in priorities"
          :key="p"
          :icon="icon('star')"
          class="icon priority-icon"
          v-bind:class="{ 'inactive': !hasPriority(p), 'highlight': hoverPriorityIcon(p) }"
          @click.stop="setPriority(item.key, p)"
          @mouseover="hoverPriority = p"
          @mouseout="hoverPriority = settings.priority.min + 1"/>
        <span class="label">{{ $t('overlay.priority') }}</span>
      </b-list-group-item>
      <b-list-group-item
        button
        v-if="!isDownloaded"
        @click.stop="setDownloaded(selectedItem, true, seasons), $emit('close')"
        class="action button-blue">
        <font-awesome-icon
          :icon="icon('check')"
          class="icon"/>
        <span class="label">{{ $t('overlay.check') }}</span>
      </b-list-group-item>
      <b-list-group-item
        button
        v-if="isDownloaded"
        @click.stop="setDownloaded(selectedItem, false, seasons), $emit('close')"
        class="action button-blue">
        <font-awesome-icon
          :icon="icon('redo')"
          class="icon"/>
        <span class="label">{{ $t('overlay.redo') }}</span>
      </b-list-group-item>
      <b-list-group-item
        button
        @click.stop="removeItem(item.key), $emit('close')"
        class="action button-blue">
        <font-awesome-icon
          :icon="icon('minus')"
          class="icon"/>
        <span class="label">{{ $t('overlay.remove') }}</span>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import UtilsMixin from '../mixins/utils'
import TransactionsMixon from '../mixins/transactions'
import IconsMixin from '../mixins/icons'

export default {
  name: 'MediaCardEditOverlay',
  props: ['item', 'editMode', 'showPriorityControls', 'showReDownloadControls', 'selectedItem', 'seasons', 'isDownloaded'],
  mixins: [UtilsMixin, TransactionsMixon, IconsMixin],
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
        return this.settings.priority.none
      }
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
    },
    incrementPriority () {
      let priority = this.selectedItem.priority - 1
      if (priority < this.settings.priority.max) {
        priority = this.settings.priority.min
      }
      this.setPriority(this.selectedItem.key, priority)
      this.hoverPriority = this.settings.priority.min + 1
    }
  },
  i18n: {
    messages: {
      de: {
        overlay: {
          priority: 'Priorität',
          check: 'Erledigt',
          redo: 'Redownload',
          remove: 'Entfernen'
        },
        mediaCard: {
          changepriority: 'Priorität',
          redownload: 'Erneut Herunterladen',
          markAsDownloaded: 'Als heruntergeladen markieren'
        }
      },
      en: {
        overlay: {
          priority: 'Priority',
          check: 'Done',
          redo: 'Redownload',
          remove: 'Remove'
        },
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
  padding: 0;
}
.overlay-content {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: white;
}
.actions {
  height: 100%;
}
.action {
  height: 33.33%;
  background-color: rgba(0, 0, 0, 0);
  padding: 0 10px 0 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.actions .icon {
  color: white;
  height: 26px;
  width: 26px;
}
.action .label {
  color: white;
  float: right;
  text-transform: uppercase;
}
.action .icon.inactive {
  opacity: 0.5;
}
.action .icon.inactive.highlight {
  opacity: 1;
}
.action .icon.highlight {
  opacity: 1;
}
</style>
