<template>
  <div class="media-list">
    <div class="export">
      <export v-bind:items="sortedItems"
        v-bind:sort="sort"
        v-bind:filter="filter"/>
    </div>
    <div v-for="item in pagedItems" :key="item.key" class="list-item">
      <div>
        <span>
          <font-awesome-icon v-if="item.media_type === 'movie'" :icon="icon('movie')" style="color: skyblue"/>
          <font-awesome-icon v-if="item.media_type === 'tv'" :icon="icon('tv')" style="color: orange"/>
          <router-link v-bind:to="infoUrl(item)"><a class="label">{{ getTitle(item) }}</a></router-link>
          <span>({{ getReleaseDateFormated(item, 'YYYY') }})</span>
          <!--
          <span class="item-status d-none d-lg-inline">
            <span>&ndash;</span>
            <span v-if="item.downloaded">{{ $t('downloaded') }}</span>
            <span v-if="!item.downloaded && itemIsUnreleased(item)">{{ $t('unreleased') }}</span>
            <span v-if="!item.downloaded && !itemIsUnreleased(item) && item.downloadStatus">{{ $t(item.downloadStatus) }}</span>
            <span v-if="!item.downloaded && !itemIsUnreleased(item) && !item.downloadStatus">{{ $t('todo') }}</span>
          </span>
          -->
        </span>
        <span class="float-right d-none d-sm-inline">
          <!--
          <span v-if="item.downloadStatus" class="status-text">{{ $t(item.downloadStatus) }}</span>
          <span v-if="!item.downloadStatus" class="status-text">{{ $t('todo') }}</span>
          -->
          <font-awesome-icon
            v-for="p in priorities"
            :key="p"
            :icon="icon('star')"
            class="priority-icon"
            v-bind:class="[{ 'highlighted' :item.priority <= p }, icon]"
            @click.stop="setItemPriority(item, p)" @mouseover="hoverPriority = p" @mouseout="hoverPriority = settings.priority.min + 1"/>
        </span>
      </div>
      <div v-if="settings.showCastOnList" class="info">
        <span class="info-label">{{ $t('cast') }}:&nbsp;</span>
        <span class="info-text">{{ item.cast }}</span>
      </div>
      <div v-if="settings.showDirectorOnList && item.media_type === 'movie'" class="info">
        <span class="info-label">{{ $t('director') }}:&nbsp;</span>
        <span class="info-text">{{ item.director }}</span>
      </div>
      <div v-if="settings.showGenresOnList && item.genres" class="info">
        <span class="info-label">{{ $t('genres') }}:&nbsp;</span>
        <span class="info-text">{{ genres(item) }}</span>
      </div>
      <div v-if="settings.showStatusOnList" class="info">
        <span class="info-label">{{ $t('status') }}:&nbsp;</span>
        <span class="info-text">
          <font-awesome-icon
            :icon="icon(itemStatusIconName(item))"
            v-bind:class="{ 'green': itemIsDownloaded(item), 'skyblue' : itemIsQueued(item), 'orange': itemIsUnreleased(item), 'yellow': itemIsNotYetAvailable(item) || itemIsHardToFind(item) }"
          />
        </span>
        <span v-if="item.downloadStatus" class="info-text">{{ $t(item.downloadStatus) }}</span>
        <span v-if="!item.downloadStatus" class="info-text">{{ $t('todo') }}</span>

      </div>
    </div>
  </div>
</template>

<script>
import Export from './Export'

import MetadataMixin from '../mixins/metadata'
import UtilsMixin from '../mixins/utils'
import IconsMixin from '../mixins/icons'

export default {
  name: 'MediaList',
  mixins: [UtilsMixin, MetadataMixin, IconsMixin],
  props: ['items', 'sort', 'filter', 'paging', 'page', 'pageSize'],
  data () {
    return {
    }
  },
  components: {
    'export': Export
  },
  computed: {
    filteredItems () {
      if (this.filter) {
        let items = this.items.filter(this.filterItem)
        return items
      } else {
        return this.items
      }
    },
    sortedItems () {
      let filtered = this.filteredItems
      if (this.sort) {
        let items = filtered.sort(this.sortItem)
        return items
      } else {
        return filtered
      }
    },
    pagedItems () {
      if (!this.paging) {
        return this.sortedItems
      }
      return this.sortedItems.slice(0, this.page * this.pageSize)
    }
  },
  methods: {
    infoUrl (item) {
      let infoUrl = `/list/${item.media_type}/${item.id}`
      return infoUrl
    },
    genres (item) {
      let genres = item.genres
      if (genres === null) {
        return '-'
      }

      let names = genres.map(x => x.name)

      return names.join(', ')
    }
  },
  i18n: {
    messages: {
      de: {
        title: 'Titel',
        status: 'Status',
        type: 'Typ',
        tv: 'Serie',
        movie: 'Film',
        release: 'Veröffentlichung',
        priority: 'Priorität',
        todo: 'ToDo',
        downloaded: 'Heruntergeladen',
        unreleased: 'Unveröffentlicht',
        notYetAvailable: 'Noch nicht erhältlich',
        hardToFind: 'Noch nicht gefunden',
        queued: 'Wird heruntergeladen',
        export: 'Liste exportieren',
        director: 'Regie',
        cast: 'Besetzung',
        genres: 'Genres'
      },
      en: {
        title: 'Title',
        status: 'Status',
        type: 'Type',
        tv: 'TV Show',
        movie: 'Movie',
        release: 'Release',
        priority: 'Priority',
        todo: 'ToDo',
        downloaded: 'Downloaded',
        unreleased: 'Unreleased',
        notYetAvailable: 'Not available yet',
        hardToFind: 'Not found yet',
        queued: 'Queued',
        export: 'Export list',
        director: 'Director',
        cast: 'Cast',
        genres: 'Genres'
      }
    }
  }
}
</script>

<style scoped>
.media-list {
  margin: 10px;
  padding: 10px;
  overflow: hidden;
}
.priority-icon {
  opacity: 0.5;
}
.priority-icon.highlighted {
  opacity: 1;
}
.list-item {
  margin-bottom: 10px;
  white-space: nowrap;
}
.export {
  margin-bottom: 10px;
}
.info {
  font-size: 12px;
}
.info-label {
  font-weight: bold
}
.info-text {
  color: grey;
}
.status-text {
  font-size: 12px;
  color: grey;
}
</style>
