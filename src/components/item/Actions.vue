<template>
  <b-list-group>
      <action
      v-if="details.homepage && isAvailableOnNetflix"
      v-bind:label="$t('item.action.netflix')"
      v-bind:isClickable="true"
      v-bind:isActive="false"
      v-bind:colorVariant="netflixRed"
      icon="netflix"
      @click.native="open(details.homepage)"></action>
    <!--
    <action
      v-if="downloaded"
      v-bind:label="$t('item.action.downloaded')"
      v-bind:isClickable="false"
      v-bind:isActive="true"
      v-bind:colorVariant="green"
      icon="downloaded"></action>
    -->
    <priority
      v-if="selected && !downloaded"
      v-bind:label="$t('item.action.priority')"
      v-bind:isClickable="true"
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
      v-bind:label="$t('item.action.markDownloaded' + mediaType)"
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
      <!--
    <action
      v-if="details.homepage && !isAvailableOnNetflix"
      v-bind:label="$t('item.action.homepage')"
      v-bind:isClickable="true"
      v-bind:isActive="false"
      v-bind:colorVariant="blue"
      icon="globe"
      @click.native="open(details.homepage)"></action>
    <action
      v-if="movieDbUrl"
      v-bind:label="$t('item.action.moviedb')"
      v-bind:isClickable="true"
      v-bind:isActive="false"
      v-bind:colorVariant="blue"
      icon="info"
      @click.native="open(movieDbUrl)"></action>
      -->
  </b-list-group>
</template>

<script>
import ItemAction from './Action'
import ItemPriority from './Priority'

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
      darkgrey: '#333333',
      grey: '#666666',
      netflixRed: '#B9090B',
      gold: '#dd9c25'
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
    selected () {
      return this.item && this.item.priority > 0
    },
    downloaded () {
      if (this.item) {
        return this.item.downloaded
      }
      return false
    },
    movieDbUrl () {
      return 'https://www.themoviedb.org/' + this.mediaType + '/' + this.details.id
    },
    homepage () {
      return this.details.homepage
    },
    isAvailableOnNetflix () {
      if (this.details.homepage) {
        return this.details.homepage.includes('www.netflix.com/')
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
        // this.$store.dispatch('removeItem', this.item.key)
        this.item.priority = 0
        this.$store.dispatch('updateItem', this.item)
      } else {
        this.details.priority = this.defaultPriority
        this.details.media_type = this.mediaType
        this.details.key = this.mediaType + ':' + this.details.id
        this.$store.dispatch('updateItem', this.details)
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
