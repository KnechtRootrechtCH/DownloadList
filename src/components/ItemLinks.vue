<template>
  <b-list-group>
    <action
      v-if="movieDbUrl"
      v-bind:label="$t('item.links.moviedb')"
      v-bind:isClickable="true"
      v-bind:isActive="false"
      v-bind:colorVariant="blue"
      icon="info"
      @click.native="open(movieDbUrl)"></action>
    <action
      v-if="details.homepage"
      v-bind:label="$t('item.links.homepage')"
      v-bind:isClickable="true"
      v-bind:isActive="false"
      v-bind:colorVariant="blue"
      icon="globe"
      @click.native="open(details.homepage)"></action>
  </b-list-group>
</template>

<script>
import ItemAction from './ItemAction'

export default {
  name: 'Item',
  props: ['item', 'details', 'mediaType'],
  data () {
    return {
      green: '#339933',
      blue: '#444499',
      red: '#CC3333',
      purple: '#CC22BB',
      grey: '#666666'
    }
  },
  components: {
    'action': ItemAction
  },
  computed: {
    movieDbUrl () {
      return 'https://www.themoviedb.org/' + this.mediaType + '/' + this.details.id
    }
  },
  methods: {
    open (url) {
      var win = window.open(url, '_blank')
      win.focus()
    }
  },
  i18n: {
    messages: {
      de: {
        item: {
          links: {
            moviedb: 'The Movie Db',
            homepage: 'Homepage'
          }
        }
      },
      en: {
        item: {
          links: {
            moviedb: 'The Movie Db',
            homepage: 'Homepage'
          }
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
