<template>
  <div class="card border-dark media-card" v-bind:class="{ 'bg-light text-dark': selected, 'bg-dark text-light': !selected }" v-on:click.stop="cardClicked()">
    <div class="card-image-top">
      <progressive-img class="card-image-backdrop" v-bind:src="backdrop" v-bind:fallback="backdropPlaceholder" :blur="2"></progressive-img>
      <div class="edit-overlay" v-bind:class="{ 'edit-overlay-active' : editMode }">
        <b-container fluid class="edit-overlay-container">
          <b-row class="edit-overlay-row">
            <b-col cols="8" class="edit-overlay-label">
              {{ $t('mediaCard.priority') }}:
            </b-col>
            <b-col cols="4" class="edit-overlay-label text-right">
              {{ $t('mediaCard.priority' + priority) }}
            </b-col>
          </b-row>
          <b-row class="edit-overlay-row">
            <b-col cols="6" class="edit-overlay-label">
              {{ $t('mediaCard.priorityChange') }}:
            </b-col>
            <b-col cols="6" class="text-right edit-overlay-icons">
            <font-awesome-icon
              v-b-tooltip
              :icon="highPriorityIcon"
              class="card-icon priority-icon"
              @click.stop="increasePriority()"
              v-bind:title="$t('mediaCard.priorityPlus')"/>
            <font-awesome-icon
              v-b-tooltip
              :icon="lowPriorityIcon"
              class="card-icon priority-icon"
              @click.stop="decreasePriority()"
              v-bind:title="$t('mediaCard.priorityMinus')"/>
              </b-col>
          </b-row>
          <b-row class="edit-overlay-row" v-if="downloaded">
            <b-col cols="9" class="edit-overlay-label">
            {{ $t('mediaCard.redownload') }}:
            </b-col>
            <b-col cols="3" class="text-right edit-overlay-icons">
            <font-awesome-icon
              v-b-tooltip
              :icon="redownloadIcon"
              class="card-icon priority-icon"
              @click.stop="setDownloaded(false)"
              v-bind:title="$t('mediaCard.redownload')"/>
              </b-col>
          </b-row>
          <b-row class="edit-overlay-row" v-if="!downloaded">
            <b-col cols="9" class="edit-overlay-label">
            {{ $t('mediaCard.markAsDownloaded') }}:
            </b-col>
            <b-col cols="3" class="text-right edit-overlay-icons">
            <font-awesome-icon
              v-b-tooltip
              :icon="downloadedIcon"
              class="card-icon priority-icon"
              @click.stop="setDownloaded(true)"
              v-bind:title="$t('mediaCard.markAsDownloaded')"/>
              </b-col>
          </b-row>
        </b-container>
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
           <font-awesome-icon
            v-b-tooltip
            :icon="infoIcon"
            class="card-icon"
            @click.stop="openInformationUrl()"
            v-bind:title="$t('mediaCard.tooltip.info')"/>
          </div>
          <div class='col-xs-6'>
            <font-awesome-icon
              v-b-tooltip
              v-if="selected"
              :icon="editIcon"
              class="card-icon"
              @click.stop="editMode = !editMode"
              v-bind:title="$t('mediaCard.tooltip.edit')"/>
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

import highPriorityIcon from '@fortawesome/fontawesome-free-solid/faArrowAltCircleUp'
import mediumPriorityIcon from '@fortawesome/fontawesome-free-solid/faCircle'
import lowPriorityIcon from '@fortawesome/fontawesome-free-solid/faArrowAltCircleDown'

export default {
  name: 'MediaCard',
  props: ['item'],
  data () {
    return {
      lowestPriority: 3,
      defaultPriority: 2,
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

      var selectedItem = this.$store.getters.item(this.item.key)
      if (selectedItem) {
        this.$store.dispatch('setItemDownloaded', {
          key: selectedItem.key,
          downloaded: downloaded})
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
            edit: 'Priorität ändern',
            downloaded: 'Bereits heruntergeladen',
            info: 'Zusätzliche Informationen von "TheMovieDB.org"'
          },
          movie: {
            dateNotFound: '-'
          },
          tv: {
            dateNotFound: '-'
          },
          priority: 'Aktuelle Priorität',
          priority3: 'Tief',
          priority2: 'Mittel',
          priority1: 'Hoch',
          priority0: 'Keine',
          priorityChange: 'Priorität ändern',
          priorityPlus: 'Priorität erhöhen',
          priorityMinus: 'Priorität senken',
          redownload: 'Re-Download',
          markAsDownloaded: 'Als Heruntergeladen markieren'
        }
      },
      en: {
        mediaCard: {
          tooltip: {
            add: 'Add to download list',
            remove: 'Remove from download list',
            edit: 'Change priority',
            downloaded: 'Downloaded',
            info: 'Additional information from "TheMovieDB.org"'
          },
          movie: {
            dateNotFound: '-'
          },
          tv: {
            dateNotFound: '-'
          },
          priority: 'Current Priority',
          priority3: 'Low',
          priority2: 'Medium',
          priority1: 'High',
          priority0: 'None',
          priorityChange: 'Change priority',
          priorityPlus: 'Increase priority',
          priorityMinus: 'Decrease priority',
          redownload: 'Re-Download',
          markAsDownloaded: 'Mark downloaded'
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
.edit-overlay {
  height: 100%;
  width: 100%;
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: -1;

}
.edit-overlay-active {
  opacity: 0.8;
  z-index: 2;
  padding: 5px;
}
.edit-overlay-container {
  padding: 0;
  margin: 0;
}
.edit-overlay-row {
  margin: 4px 0 4px 0;
  height: 40px;
}
.edit-overlay-label {
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 40px;
  padding: 7px;
}
.edit-overlay-icons {
  padding-right: 7px;
}
.priority-icon-active {
  color: yellow;
}
.priority-icon:hover {
  color: black;
}
</style>
