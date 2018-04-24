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
    <!--<priority
      v-if="isSelected && !isDownloaded"
      v-bind:label="$t('item.action.priority')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.PURPLE"
      v-bind:itemKey="item.key"
      v-bind:current="item.priority"
      v-bind:isReactive="true"
      iconType="star"></priority>-->
    <priority
      v-if="isSelected && !isDownloaded"
      v-bind:label="$t('item.action.priority1')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.PURPLE"
      v-bind:itemKey="item.key"
      v-bind:current="1"
      v-bind:isReactive="false"
      @updated="$emit('close')"
      iconType="star"></priority>
    <priority
      v-if="isSelected && !isDownloaded"
      v-bind:label="$t('item.action.priority2')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.PURPLE"
      v-bind:itemKey="item.key"
      v-bind:current="2"
      v-bind:isReactive="false"
      @updated="$emit('close')"
      iconType="star"></priority>
    <priority
      v-if="isSelected && !isDownloaded"
      v-bind:label="$t('item.action.priority3')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.PURPLE"
      v-bind:itemKey="item.key"
      v-bind:current="3"
      v-bind:isReactive="false"
      @updated="$emit('close')"
      iconType="star"></priority>
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
      v-if="isSelected && isDownloaded"
      v-bind:label="$t('item.action.redownload')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.PURPLE"
      iconType="redo"
      @click.native="markDownloaded(false)"></action>
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
   <!--
    <action
      v-if="isSelected"
      v-bind:label="$t('item.action.comment')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.DARKGREY"
      iconType="comment"
      @click.native="addComment()"></action>
      -->
  </b-list-group>
</template>

<script>
import ItemAction from './Action'
import ItemPriority from './Priority'
import UtilMixins from '../../mixins/utils'

export default {
  name: 'ItemActions',
  props: ['item', 'details', 'seasons', 'mediaType', 'isSelected', 'isDownloaded', 'totalDownloadedCount', 'totalEpisodeCount'],
  mixins: [UtilMixins],
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
            markDownloadedmovie: 'Als erledigt markieren',
            markDownloadedtv: 'Als erledigt markieren',
            redownload: 'Erneut herunterladen',
            priority: 'Priorität',
            priority1: 'Hohe Priorität',
            priority2: 'Mittlere Priorität',
            priority3: 'Tiefe Priorität',
            comment: 'Kommentar hinzufügen',
            moviedb: 'The Movie Db',
            homepage: 'Homepage',
            netflix: 'Auf Netflix abspielen',
            close: 'Schliessen'
          }
        }
      },
      en: {
        item: {
          action: {
            downloaded: 'Downloaded',
            select: 'Add to list',
            deselect: 'Remove from list',
            markDownloadedmovie: 'Mark as done',
            markDownloadedtv: 'Mark as done',
            redownload: 'Mark for redownload',
            priority: 'Priority',
            priority1: 'High priority',
            priority2: 'Medium priority',
            priority3: 'Low priority',
            comment: 'Add comment',
            moviedb: 'The Movie Db',
            homepage: 'Homepage',
            netflix: 'Watch on Netflix',
            close: 'Close'
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
