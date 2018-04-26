<template>
  <b-modal centered id="edit-modal" class="edit-modal" ref="modal"
   hide-footer
   hide-header
   body-bg-variant="dark"
   v-bind:title="$t('item.dialog.title')">
    <item-actions
      v-bind:item="item"
      v-bind:details="details"
      v-bind:seasons="seasons"
      v-bind:mediaType="mediaType"
      v-bind:isSelected="isSelected"
      v-bind:isDownloaded="isDownloaded"
      v-bind:totalDownloadedCount="totalDownloadedCount"
      v-bind:totalEpisodeCount="totalEpisodeCount"
      @close="hide"
      @addComment="addComment">
    </item-actions>
    <!--<b-btn class="mt-3" variant="secondary" block @click="hide">{{ $t('item.dialog.close') }}</b-btn>-->
  </b-modal>
</template>

<script>
import ItemActions from './Actions'
import UtilsMixin from '../../mixins/utils'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'EditDialog',
  props: ['item', 'details', 'seasons', 'mediaType', 'isSelected', 'isDownloaded', 'totalDownloadedCount', 'totalEpisodeCount'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
    }
  },
  components: {
    'item-actions': ItemActions
  },
  computed: {
  },
  methods: {
    show () {
      this.$refs.modal.show()
    },
    hide () {
      this.$refs.modal.hide()
    },
    addComment () {
      this.hide()
      this.$emit('addComment')
    }
  },
  i18n: {
    messages: {
      de: {
        item: {
          dialog: {
            title: 'Bearbeiten',
            close: 'Schliessen'
          }
        }
      },
      en: {
        item: {
          dialog: {
            title: 'Edit',
            close: 'Close'
          }
        }
      }
    }
  }
}
</script>

<style scoped>
div.modal-body {
  padding: 0 !important;
}
</style>
