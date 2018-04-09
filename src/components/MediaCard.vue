<template>
  <div class="card border-dark media-card" v-bind:class="{ 'bg-light text-dark': selected, 'bg-dark text-light': !selected }" v-on:click.stop="cardClicked()">
    <div class="card-img-top">
      <div class="overlay-container">
        <progressive-img v-bind:src="backdrop" v-bind:fallback="backdropPlaceholder" :blur="2"></progressive-img>
        <overlay v-bind:item="item" v-bind:editMode="editModeActive" v-bind:showPriorityControls="showPriorityControls" v-bind:showReDownloadControls="showReDownloadControls" ></overlay>
      </div>
    </div>
    <div class="card-body">
      <div class="card-icons container-fluid">
        <div class="row">
          <div class="card-title col-xs-12">{{ title }}</div>
        </div>
        <div class="row">
          <div class="card-release col-xs-12">{{ releaseDate }}</div>
        </div>
        <div class="row justify-content-between">
          <div class='col-xs-6'>
            <router-link v-bind:to="'/' + detailsRouterPrefix + '/' + item.media_type + '/' + item.id">
              <font-awesome-icon
                v-b-tooltip
                :icon="infoIcon"
                class="card-icon"
                v-bind:title="$t('mediaCard.tooltip.info')"/>
            </router-link>
          </div>
          <div class='col-xs-6'>
            <font-awesome-icon
              v-b-tooltip
              v-if="showEditButton && selected"
              :icon="editIcon"
              class="card-icon"
              @click.stop="editModeInternal = !editModeInternal, destroyTooltips()"
              v-bind:title="$t('mediaCard.tooltip.editPriority')"/>
            <font-awesome-icon
              v-b-tooltip
              v-if="selected && !downloaded"
              :icon="removeIcon"
              class="card-icon"
              @click.stop="toggleItem"
              v-bind:title="$t('mediaCard.tooltip.remove')"/>
            <font-awesome-icon
              v-b-tooltip
              v-if="!selected && !downloaded"
              :icon="addIcon"
              class="card-icon"
              @click.stop="toggleItem"
              v-bind:title="$t('mediaCard.tooltip.add')"/>
            <font-awesome-icon
              v-b-tooltip
              v-if="downloaded"
              :icon="downloadedIcon"
              class="card-icon check-icon"
              v-bind:title="$t('mediaCard.tooltip.downloaded')"/>
          </div>
        </div>
      </div>
    </div>
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

import MediaCardEditOverlay from './MediaCardOverlay'

export default {
  name: 'MediaCard',
  props: ['item',
    'showEditButton',
    'editModeHandling',
    'editMode',
    'showPriorityControls',
    'showReDownloadControls',
    'detailsRouterPrefix'],
  data () {
    return {
      editModeInternal: false,
      defaultPriority: 2
    }
  },
  components: {
    FontAwesomeIcon,
    'overlay': MediaCardEditOverlay
  },
  computed: {
    editModeActive () {
      switch (this.editModeHandling) {
        case 'internal':
          return this.editModeInternal
        case 'selected':
          return this.selected
        case 'external':
          return this.editMode || this.editModeInternal
        default:
          return this.editModeInternal
      }
    },
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
      return selectedItem && selectedItem.priority > 0
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

      var selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem && selectedItem.priority > 0) {
        if (selectedItem.downloaded) {
          return
        }
        // this.$store.dispatch('removeItem', selectedItem.key)
        selectedItem.priority = 0
        this.$store.dispatch('updateItem', selectedItem)
        this.editModeInternal = false
      } else {
        this.item.priority = this.defaultPriority
        this.$store.dispatch('addItem', this.item)
      }
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
            add: 'Diesen Titel der Downloadliste hinzufügen',
            remove: 'Aus Downloadliste entfernen',
            editPriority: 'Priorität ändern',
            downloaded: 'Bereits heruntergeladen',
            info: 'Zusätzliche Informationen von "TheMovieDB.org"'
          },
          movie: {
            dateNotFound: '-'
          },
          tv: {
            dateNotFound: '-'
          }
        }
      },
      en: {
        mediaCard: {
          tooltip: {
            add: 'Add to download list',
            remove: 'Remove from download list',
            editPriority: 'Change priority',
            downloaded: 'Downloaded',
            info: 'Additional information from "TheMovieDB.org"'
          },
          movie: {
            dateNotFound: '-'
          },
          tv: {
            dateNotFound: '-'
          }
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
.media-card {
  transition: transform .5s;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.media-card:hover {
  transform: scale(1.05);
}
.card-image-top {
  background-color: #343a40;
}
.card-body {
  padding: 10px;
  z-index: 3;
}
.card-title {
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;
}
.card-release {
  margin-bottom: 4px;
}
.card-icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
}
.check-icon {
  color: darkgreen;
}
.overlay-container {
  width: 100%;
  height: 100%;
  position: relative;
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
a {
  color: inherit;
}
a:hover {
  color: inherit;
}
</style>
