<template>
  <div class="card border-dark media-card" v-bind:class="{ 'bg-light text-dark': isSelected, 'bg-dark text-light': !isSelected }">
    <div class="card-img-top">
      <div class="overlay-container">
        <router-link v-bind:to="infoUrl">
          <progressive-img v-bind:src="backdrop" v-bind:fallback="backdropPlaceholder" :blur="2"></progressive-img>
        </router-link>
        <overlay
          v-if="editMode || forceEditOverlay"
          v-bind:item="item"
          v-bind:editMode="editMode"
          v-bind:selectedItem="selectedItem"
          v-bind:sDownloaded="item.downloaded"
          @close="editMode = false"></overlay>
      </div>
    </div>
    <div class="card-body">
      <div class="card-icons container-fluid">
        <div class="row">
          <div class="card-title col-xs-12">
            <span>{{ getTitle(item) }}</span>
          </div>
        </div>
        <div class="row justify-content-between">
          <div class="col-xs-4 card-release">
            <span>{{ getReleaseDateFormated(item, 'YYYY') }}</span>
            <font-awesome-icon v-if="item.media_type === 'movie'" :icon="icon('movie')" style="color: skyblue"/>
            <font-awesome-icon v-if="item.media_type === 'tv'" :icon="icon('tv')" style="color: orange"/>
          </div>
          <div class="col-xs-8 card-release">
            <span v-if="selectedItem && !itemIsDownloaded(selectedItem) && itemIsUnreleased(selectedItem)" class="card-downloadstatus">{{ $t('mediaCard.unreleased')}}</span>
            <span v-if="selectedItem && !itemIsDownloaded(selectedItem) && !itemIsUnreleased(selectedItem) && selectedItem.downloadStatus" class="card-downloadstatus">{{ $t('mediaCard.' + selectedItem.downloadStatus)}}</span>
          </div>
        </div>
        <div class="row justify-content-between">
          <div class='col-xs-6'>
            <router-link v-bind:to="infoUrl" v-if="!isSelected || !showPriorityIcons">
              <font-awesome-icon
                :icon="icon('info')"
                class="card-icon info-icon"
                v-bind:title="$t('mediaCard.tooltip.info')"/>
            </router-link>
            <font-awesome-icon
              v-if="isSelected && showPriorityIcons"
              v-for="p in priorities"
              :key="p"
              :icon="icon('star')"
              class="card-icon"
              v-bind:class="{ 'inactive': !hasPriority(p), 'highlight': hoverPriorityIcon(p) }"
              @click.stop="setPriority(item.key, p)"
              @mouseover="hoverPriority = p"
              @mouseout="hoverPriority = settings.priority.min + 1"/>
          </div>
          <div class='col-xs-6'>
            <font-awesome-icon
              v-if="isSelected"
              :icon="icon(itemStatusIconName(selectedItem))"
              class="card-icon"
              @click.stop="editMode = !editMode"
              v-bind:title="$t('mediaCard.tooltip.editPriority')"/>
            <font-awesome-icon
              v-if="!isSelected"
              :icon="icon('plus')"
              class="card-icon"
              @click.stop="add"
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
import ImagesMixin from '../mixins/images'
import MetadataMixin from '../mixins/metadata'
import TransactionsMixon from '../mixins/transactions'
import IconsMixin from '../mixins/icons'

export default {
  name: 'MediaCard',
  props: ['item', 'mode', 'forceEditOverlay', 'showPriorityIcons', 'detailsRouterPrefix'],
  mixins: [UtilsMixin, ImagesMixin, MetadataMixin, TransactionsMixon, IconsMixin],
  data () {
    return {
      editMode: false,
      hoverPriority: 100
    }
  },
  components: {
    'overlay': MediaCardEditOverlay
  },
  computed: {
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
      if (this.mode === 'list') {
        return this.item
      }
      let selectedItem = this.$store.getters.item(this.item.key)
      return selectedItem
    },
    isSelected () {
      if (this.mode === 'list') {
        return true
      }
      return this.selectedItem && this.selectedItem.priority > 0
    },
    infoUrl () {
      let infoUrl = '/' + this.detailsRouterPrefix + '/' + this.item.media_type + '/' + this.item.id
      return infoUrl
    }
  },
  methods: {
    clicked () {
      if (this.editMode) {
        return
      }
      this.routeTo(this.infoUrl)
    },
    add () {
      this.editMode = false
      this.addItem(this.item)
    },
    hasPriority (priority) {
      if (this.selectedItem) {
        return this.selectedItem.priority <= priority
      }
      return false
    },
    hoverPriorityIcon (priority) {
      return priority >= this.hoverPriority
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
          },
          unreleased: 'Unveröffentlicht',
          notYetAvailable: 'Noch nicht erhältlich',
          hardToFind: 'Noch nicht gefunden',
          queued: 'Wird heruntergeladen'
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
          },
          unreleased: 'Unreleased',
          notYetAvailable: 'Not available yet',
          hardToFind: 'Not found yet',
          queued: 'Queued'
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
.card-img-top {
  background-color: #343a40;
  cursor: pointer;
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
.card-downloadstatus {
  margin-bottom: 4px;
  opacity: 0.6;
  font-style: italic;
}
.card-icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
}
.overlay-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.card-icon.inactive {
  opacity: 0.5;
}
.card-icon.inactive.highlight {
  opacity: 1;
}
.card-icon.highlight {
  opacity: 1;
}
a {
  color: white !important;
}
a:hover {
  color: white !important;
}
</style>
