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
      iconType="star"></priority>
    <action
      v-if="!isSelected"
      v-bind:label="$t('item.action.select')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.BLUE"
      iconType="plus"
      @click.native="addItem(details, mediaType)"></action>
    <action
      v-if="isSelected && !isDownloaded"
      v-bind:label="$t('item.action.markDownloaded' + mediaType)"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.GREEN"
      iconType="check"
      @click.native="setDownloaded(item.key, true)"></action>
    <action
      v-if="isSelected && isDownloaded"
      v-bind:label="$t('item.action.redownload')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.PURPLE"
      iconType="redo"
      @click.native="setDownloaded(item.key, false)"></action>
    <action
      v-if="isSelected && !isDownloaded"
      v-bind:label="$t('item.action.deselect')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.RED"
      iconType="minus"
      @click.native="removeItem(item.key)"></action>
    <action
      v-if="isSelected"
      v-bind:label="$t('item.action.comment')"
      v-bind:isClickable="true"
      v-bind:color="constants.COLOR.DARKGREY"
      iconType="comment"
      @click.native="addComment()"></action>
  </b-list-group>
</template>

<script>
import ItemAction from './Action'
import ItemPriority from './Priority'
import UtilMixins from '../../mixins/utils'

export default {
  name: 'ItemActions',
  props: ['item', 'details', 'mediaType'],
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
    },
    isSelected () {
      return this.item && this.item.priority > 0
    },
    isDownloaded () {
      if (this.item) {
        return this.item.downloaded
      }
      return false
    }
  },
  methods: {
    addComment () {
      this.$emit('addComment')
    },
    openNetflixUrl () {
      let netflixUrl = this.getNetflixUrl(this.details)
      if (netflixUrl) {
        this.openUrl(netflixUrl)
      }
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
            comment: 'Kommentar hinzufügen',
            moviedb: 'The Movie Db',
            homepage: 'Homepage',
            netflix: 'Auf Netflix abspielen'
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
            comment: 'Add comment',
            moviedb: 'The Movie Db',
            homepage: 'Homepage',
            netflix: 'Watch on Netflix'
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
