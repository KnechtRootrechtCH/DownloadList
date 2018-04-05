<template>
  <b-list-group>
    <action
      v-if="downloaded"
      v-bind:label="$t('item.action.downloaded')"
      v-bind:isClickable="false"
      v-bind:isActive="true"
      v-bind:colorVariant="green"
      icon="downloaded"></action>
    <priority
      v-if="selected && !downloaded"
      v-bind:label="$t('item.action.priority')"
      v-bind:colorVariant="purple"
      v-bind:itemKey="item.key"
      v-bind:current="item.priority"
      icon="star"
      @click.native="setDownloaded(false)"></priority>
    <action
      v-if="!selected"
      v-bind:label="$t('item.action.select')"
      v-bind:isClickable="true"
      v-bind:colorVariant="blue"
      icon="add"
      @click.native="setSelected(true)"></action>
    <action
      v-if="selected && !downloaded"
      v-bind:label="$t('item.action.markDownloaded')"
      v-bind:isClickable="true"
      v-bind:colorVariant="green"
      icon="downloaded"
      @click.native="setDownloaded(true)"></action>
    <action
      v-if="selected && downloaded"
      v-bind:label="$t('item.action.redownload')"
      v-bind:isClickable="true"
      v-bind:colorVariant="purple"
      icon="redownload"
      @click.native="setDownloaded(false)"></action>
    <action
      v-if="selected && !downloaded"
      v-bind:label="$t('item.action.deselect')"
      v-bind:isClickable="true"
      v-bind:colorVariant="red"
      icon="remove"
      @click.native="setSelected(false)"></action>
    <action
      v-if="selected"
      v-bind:label="$t('item.action.comment')"
      v-bind:isClickable="true"
      v-bind:colorVariant="grey"
      icon="comment"
      @click.native="addComment()"></action>
  </b-list-group>
</template>

<script>
import ItemAction from './ItemAction'
import ItemPriority from './ItemPriority'

export default {
  name: 'ItemActions',
  props: ['item', 'details', 'mediaType'],
  data () {
    return {
      lowestPriority: 3,
      defaultPriority: 2,
      green: '#339933',
      blue: '#444499',
      red: '#CC3333',
      purple: '#CC22BB',
      grey: '#666666'
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
      } else {
        return 0
      }
    },
    movieDbUrl () {
      this.destroyTooltips()
      return 'https://www.themoviedb.org/' + this.mediaType + '/' + this.id
    },
    selected () {
      return this.item
    },
    downloaded () {
      if (this.item) {
        return this.item.downloaded
      }
      return false
    }
  },
  methods: {
    open (url) {
      var win = window.open(url, '_blank')
      win.focus()
    },
    setSelected (select) {
      if (!select) {
        this.$store.dispatch('removeItem', this.item.key)
      } else {
        this.details.priority = this.defaultPriority
        this.details.media_type = this.mediaType
        this.details.key = this.mediaType + ':' + this.details.id
        this.$store.dispatch('addItem', this.details)
      }
    },
    setDownloaded (downloaded) {
      if (this.item) {
        this.$store.dispatch('setItemDownloaded', {
          key: this.item.key,
          downloaded: downloaded})
      }
    },
    addComment () {
      alert('comming soon')
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
            markDownloaded: 'Als heruntergeladen markieren',
            redownload: 'Erneut herunterladen',
            priority: 'Download Priorität',
            comment: 'Kommentar hinzufügen'
          }
        }
      },
      en: {
        item: {
          action: {
            downloaded: 'Downloaded',
            select: 'Add to list',
            deselect: 'Remove from list',
            markDownloaded: 'Mark as downloaded',
            redownload: 'Redownload',
            priority: 'Download priority',
            comment: 'Add comment'
          }
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
