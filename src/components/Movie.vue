<template>
  <div class="item">
    {{ itemId }}
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

import infoIcon from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import addIcon from '@fortawesome/fontawesome-free-solid/faPlusCircle'
import removeIcon from '@fortawesome/fontawesome-free-solid/faMinusCircle'
import priorityIcon from '@fortawesome/fontawesome-free-solid/faStar'
import redownloadIcon from '@fortawesome/fontawesome-free-solid/faRedoAlt'
import downloadedIcon from '@fortawesome/fontawesome-free-solid/faCheckCircle'
import editIcon from '@fortawesome/fontawesome-free-solid/faEdit'

import highPriorityIcon from '@fortawesome/fontawesome-free-solid/faArrowAltCircleUp'
import mediumPriorityIcon from '@fortawesome/fontawesome-free-solid/faCircle'
import lowPriorityIcon from '@fortawesome/fontawesome-free-solid/faArrowAltCircleDown'

export default {
  name: 'Movie',
  props: ['itemId'],
  data () {
    return {
      lowestPriority: 3,
      defaultPriority: 2,
      hoverPriority: 10,
      editMode: false
    }
  },
  components: {
    FontAwesomeIcon
  },
  computed: {
    title () {
      if (this.item.media_type === 'movie') {
        return this.item.title
      } else if (this.item.media_type === 'tv') {
        return this.item.name
      }
    },
    releaseDate () {
      let date = null
      if (this.item.media_type === 'movie') {
        date = this.item.release_date
      } else if (this.item.media_type === 'tv') {
        date = this.item.first_air_date
      }

      if (!date) {
        return this.$i18n.t('mediaCard.' + this.item.media_type + '.dateNotFound')
      }
      let moment = this.$moment(date)
      let formated = moment.format('YYYY')
      if (formated) {
        return formated
      } else {
        return this.$i18n.t('mediaCard.' + this.item.media_type + '.dateNotFound')
      }
    },
    rating () {
      return this.item.vote_average
    },
    backdrop () {
      if (this.item.backdrop_path) {
        return 'https://image.tmdb.org/t/p/w500' + this.item.backdrop_path
      } else {
        return ''
      }
    },
    priority () {
      let selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        return selectedItem.priority
      } else {
        return 0
      }
    },
    addIcon () {
      return addIcon
    },
    downloadedIcon () {
      return downloadedIcon
    },
    removeIcon () {
      return removeIcon
    },
    infoIcon () {
      return infoIcon
    },
    priorityIcon () {
      return priorityIcon
    },
    editIcon () {
      return editIcon
    },
    highPriorityIcon () {
      return highPriorityIcon
    },
    mediumPriorityIcon () {
      return mediumPriorityIcon
    },
    lowPriorityIcon () {
      return lowPriorityIcon
    },
    redownloadIcon () {
      return redownloadIcon
    },
    backdropPlaceholder () {
      if (this.item.media_type === 'movie') {
        return this.$store.getters.fallbackMovieBackdrop
      } else if (this.item.media_type === 'tv') {
        return this.$store.getters.fallbackTvBackdrop
      }
    },
    selected () {
      var selectedItem = this.$store.getters.item(this.item.key)
      return selectedItem
    },
    downloaded () {
      var selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        return selectedItem.downloaded
      }
      return false
    }
  },
  methods: {
    cardClicked () {
      // open item detail page
    },
    openInformationUrl () {
      this.destroyTooltips()
      var url = 'https://www.themoviedb.org/' + this.item.media_type + '/' + this.item.id
      var win = window.open(url, '_blank')
      win.focus()
    },
    toggleItem () {
      this.destroyTooltips()
      this.editMode = false

      var selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        if (selectedItem.downloaded) {
          return
        }
        this.$store.dispatch('removeItem', selectedItem.key)
      } else {
        this.item.priority = this.defaultPriority
        this.$store.dispatch('addItem', this.item)
      }
    },
    increasePriority () {
      this.destroyTooltips()

      var selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem && selectedItem.priority > 1) {
        selectedItem.priority--
        this.$store.dispatch('setItemPriority', {
          key: selectedItem.key,
          priority: selectedItem.priority})
      }
    },
    decreasePriority () {
      this.destroyTooltips()

      var selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem && selectedItem.priority < this.lowestPriority) {
        selectedItem.priority++
        this.$store.dispatch('setItemPriority', {
          key: selectedItem.key,
          priority: selectedItem.priority})
      }
    },
    hasPriority (priority) {
      var selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        return selectedItem.priority <= priority
      }
      return false
    },
    setPriority (priority) {
      this.destroyTooltips()
      this.editMode = false

      var selectedItem = this.$store.getters.item(this.item.key)
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
      this.editMode = false

      var selectedItem = this.$store.getters.item(this.item.key)
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
        }
      },
      en: {
        mediaCard: {
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
