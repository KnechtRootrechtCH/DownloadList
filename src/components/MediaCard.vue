<template>
  <div class="card border-dark media-card" v-bind:class="{ 'bg-light text-dark': isSelected, 'bg-dark text-light': !isSelected }">
    <div class="card-img-top" v-on:click.stop="cardClicked()">
      <div class="overlay-container">
        <progressive-img v-bind:src="backdrop" v-bind:fallback="backdropPlaceholder" :blur="2"></progressive-img>
        <overlay
          v-bind:item="item"
          v-bind:editMode="editModeActive"
          v-bind:selectedItem="selectedItem"
          v-bind:seasons="seasons"
          v-bind:isDownloaded="isDownloaded"
          @close="editModeInternal = false"></overlay>
      </div>
    </div>
    <div class="card-body">
      <div class="card-icons container-fluid">
        <div class="row">
          <div class="card-title col-xs-12">{{ getTitle(item) }}</div>
        </div>
        <div class="row">
          <div class="card-release col-xs-12">{{ getReleaseDateFormated(item, 'YYYY') }}</div>
        </div>
        <div class="row justify-content-between">
          <div class='col-xs-6'>
            <router-link v-bind:to="infoUrl">
              <font-awesome-icon
                :icon="icon('info')"
                class="card-icon info-icon"
                v-bind:title="$t('mediaCard.tooltip.info')"/>
            </router-link>
          </div>
          <div class='col-xs-6'>
            <font-awesome-icon
              v-if="showEditButton && isSelected"
              :icon="editIcon"
              class="card-icon"
              v-bind:class="{ 'check-icon': isDownloaded }"
              @click.stop="editModeInternal = !editModeInternal"
              v-bind:title="$t('mediaCard.tooltip.editPriority')"/>
            <font-awesome-icon
              v-if="!isSelected"
              :icon="icon('plus')"
              class="card-icon"
              @click.stop="toggleItem"
              v-bind:title="$t('mediaCard.tooltip.add')"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MediaCardEditOverlay from './MediaCardOverlay'
import UtilsMixin from '../mixins/utils'
import IconsMixin from '../mixins/icons'

export default {
  name: 'MediaCard',
  props: ['item',
    'showEditButton',
    'editModeHandling',
    'editMode',
    'showPriorityControls',
    'showReDownloadControls',
    'detailsRouterPrefix'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
      editModeInternal: false
    }
  },
  components: {
    'overlay': MediaCardEditOverlay
  },
  computed: {
    editModeActive () {
      if (!this.isSelected) {
        return false
      }
      switch (this.editModeHandling) {
        case 'internal':
          return this.editModeInternal
        case 'selected':
          return this.isSelected
        case 'external':
          return this.editMode || this.editModeInternal
        default:
          return this.editModeInternal
      }
    },
    rating () {
      return this.item.vote_average
    },
    backdrop () {
      return this.getBackdropImage(this.item, this.constants.IMAGESIZE.BACKDROP.W500)
    },
    backdropPlaceholder () {
      return this.getBackdropPlaceholder(this.constants.IMAGESIZE.BACKDROP.W500)
    },
    selectedItem () {
      let selectedItem = this.$store.getters.item(this.item.key)
      return selectedItem
    },
    isSelected () {
      return this.selectedItem && this.selectedItem.priority > 0
    },
    isDownloaded () {
      if (!this.selectedItem) {
        return false
      }
      if (this.isTv(this.selectedItem)) {
        return this.totalDownloadedCount > 0 && this.totalDownloadedCount === this.totalEpisodeCount
      } else {
        return this.selectedItem.downloaded
      }
    },
    infoUrl () {
      let infoUrl = '/' + this.detailsRouterPrefix + '/' + this.item.media_type + '/' + this.item.id
      return infoUrl
    },
    movieDbUrl () {
      let url = 'https://www.themoviedb.org/' + this.item.media_type + '/' + this.item.id
      return url
    },
    editIcon () {
      if (this.isDownloaded) {
        return this.icon('check')
      } else {
        return this.icon('clock')
      }
    },
    seasons () {
      if (!this.selectedItem || !this.selectedItem.seasons) {
        return null
      }
      let seasons = this.filterSeasons(this.selectedItem.seasons, this.settings.includeSpecials)
      return seasons
    },
    totalDownloadedCount () {
      let count = 0
      if (this.isTv(this.selectedItem)) {
        let seasons = this.seasons
        if (seasons !== null) {
          this.seasons.forEach(season => {
            count += this.getEpisodeDownloadCount(this.selectedItem, season.season_number)
          })
        }
      }
      return count
    },
    totalEpisodeCount () {
      let count = 0
      if (this.isTv(this.selectedItem)) {
        let seasons = this.seasons
        if (seasons !== null) {
          this.seasons.forEach(season => {
            count += this.getEpisodeCount(season)
          })
        }
      }
      return count
    }
  },
  methods: {
    cardClicked () {
      if (this.editModeActive) {
        return
      }
      this.routeTo(this.infoUrl)
    },
    toggleItem () {
      this.editModeInternal = false
      if (this.isSelected) {
        this.removeItem(this.item.key)
      } else {
        this.addItem(this.item)
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
            info: 'Zusätzliche Informationen'
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
            info: 'Additional information'
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
  color: green;
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
