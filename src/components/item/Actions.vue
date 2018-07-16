<template>
  <b-list-group>
      <action
      v-if="isAvailableOnNetflix(details)"
      v-bind:label="$t('item.action.netflix')"
      v-bind:isClickable="true"
      v-bind:isActive="false"
      v-bind:color="constants.COLOR.NETFLIX_RED"
      iconType="play"
      @click.native="openNetflixUrl()"></action>
    <priority
      v-if="isSelected && !isDownloaded"
      v-bind:label="$t('item.action.priority')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.PURPLE"
      v-bind:itemKey="item.key"
      v-bind:current="item.priority"
      v-bind:isReactive="true"
      iconType="star"></priority>
    <!--<priority
      v-for="p in priorities"
      :key="p"
      v-if="isSelected && !isDownloaded"
      v-bind:label="$t('item.action.priority' + p)"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.PURPLE"
      v-bind:itemKey="item.key"
      v-bind:current="p"
      v-bind:isReactive="false"
      @updated="$emit('close')"
      iconType="star"></priority>-->
    <action
      v-if="!isSelected"
      v-bind:label="$t('item.action.select')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.BLUE"
      iconType="plus"
      @click.native="add"></action>
    <action
      v-if="isSelected && !isDownloaded"
      v-bind:label="$t('item.action.markDownloaded' + mediaType)"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.GREEN"
      iconType="check"
      @click.native="markDownloaded(true)"></action>
    <action
      v-if="isSelected && !isDownloaded && !isQueued"
      v-bind:label="$t('item.action.markQueued')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.BLUE"
      iconType="download"
      @click.native="updateStatus('queued')"></action>
    <action
      v-if="isSelected && !isDownloaded && !isQueued && !isNotYetAvailable"
      v-bind:label="$t('item.action.markNotYetAvailable')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.GOLD"
      iconType="calendar"
      @click.native="updateStatus('notYetAvailable')"></action>
    <action
      v-if="isSelected && !isDownloaded && !isQueued && !isUnreleased && !isHardToFind"
      v-bind:label="$t('item.action.markHardToFind')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.RED"
      iconType="exclamationTriangle"
      @click.native="updateStatus('hardToFind')"></action>
    <action
      v-if="isSelected && isDownloaded"
      v-bind:label="$t('item.action.redownload')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.PURPLE"
      iconType="redo"
      @click.native="markDownloaded(false)"></action>
    <action
      v-if="isSelected && !isDownloaded && (isQueued || isHardToFind || isNotYetAvailable)"
      v-bind:label="$t('item.action.reset')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.GREY"
      iconType="clock"
      @click.native="updateStatus(null)"></action>
    <action
      v-if="isSelected && !isDownloaded"
      v-bind:label="$t('item.action.deselect')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.RED"
      iconType="minus"
      @click.native="remove"></action>
    <!--<action
      v-bind:label="$t('item.action.close')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.DARKGREY"
      type="center"
      iconType="times"
      @click.native="$emit('close')"></action>-->
  </b-list-group>
</template>

<script>
import ItemAction from './Action'
import ItemPriority from './Priority'
import UtilMixin from '../../mixins/utils'
import MetadataMixin from '../../mixins/metadata'
import TransactionsMixin from '../../mixins/transactions'

export default {
  name: 'ItemActions',
  props: ['item', 'details', 'seasons', 'mediaType', 'isSelected', 'isDownloaded', 'isQueued', 'isHardToFind', 'isUnreleased', 'isNotYetAvailable', 'totalDownloadedCount', 'totalEpisodeCount'],
  mixins: [UtilMixin, MetadataMixin, TransactionsMixin],
  data () {
    return {
    }
  },
  components: {
    'action': ItemAction,
    'priority': ItemPriority
  },
  computed: {
    priority () {
      if (this.item) {
        return this.item.priority
      }
    }
  },
  methods: {
    add () {
      this.$emit('close')
      this.addItem(this.details, this.mediaType)
    },
    remove () {
      this.$emit('close')
      this.removeItem(this.item.key)
    },
    markDownloaded (downloaded) {
      this.$emit('close')
      this.setDownloaded(this.item, downloaded, this.seasons)
    },
    updateStatus (status) {
      this.$emit('close')
      this.setStatus(this.item, status)
    },
    openNetflixUrl () {
      this.$emit('close')
      let netflixUrl = this.getNetflixUrl(this.details)
      if (netflixUrl) {
        this.openUrl(netflixUrl)
      }
    },
    addComment () {
      this.$emit('addComment')
    }
  },
  i18n: {
    messages: {
      de: {
        item: {
          action: {
            downloaded: 'Heruntergeladen',
            select: 'Der Liste hinzufügen',
            deselect: 'Aus Liste entfernen',
            markDownloadedmovie: 'Erledigt',
            markDownloadedtv: 'Erledigt',
            markNotYetAvailable: 'Noch nicht erhältlich',
            markQueued: 'Wird heruntergeladen',
            markHardToFind: 'Schwierig zu finden',
            redownload: 'Erneut herunterladen',
            priority: 'Priorität',
            priority1: 'Hohe Priorität',
            priority2: 'Mittlere Priorität',
            priority3: 'Tiefe Priorität',
            comment: 'Kommentar hinzufügen',
            moviedb: 'The Movie Db',
            homepage: 'Homepage',
            netflix: 'Auf Netflix abspielen',
            close: 'Schliessen',
            reset: 'Status zurücksetzen'
          }
        }
      },
      en: {
        item: {
          action: {
            downloaded: 'Downloaded',
            select: 'Add to list',
            deselect: 'Remove from list',
            markDownloadedmovie: 'Done',
            markDownloadedtv: 'Done',
            markNotYetAvailable: 'Not yet available',
            markQueued: 'Queued',
            markHardToFind: 'Hard to find',
            redownload: 'Redownload',
            priority: 'Priority',
            priority1: 'High priority',
            priority2: 'Medium priority',
            priority3: 'Low priority',
            comment: 'Add comment',
            moviedb: 'The Movie Db',
            homepage: 'Homepage',
            netflix: 'Watch on Netflix',
            close: 'Close',
            reset: 'Reset status'
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.content {
  margin-bottom: 10px;
}
.tagline {
  font-weight: bold;
  font-style: italic;
}
.label {
  font-weight: bold;
}
</style>
