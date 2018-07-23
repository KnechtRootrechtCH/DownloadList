<template>
  <div class="media-list">
    <div class="export">
      <export v-bind:items="sortedItems"
        v-bind:sort="sort"
        v-bind:filter="filter"/>
    </div>
    <div v-for="item in pagedItems" :key="item.key" class="list-item">
      <span>
        <font-awesome-icon
          :icon="icon(itemStatusIconName(item))"
          v-bind:class="{ 'green': itemIsDownloaded(item), 'skyblue' : itemIsQueued(item), 'orange': itemIsUnreleased(item), 'yellow': itemIsNotYetAvailable(item) || itemIsHardToFind(item) }"
        />
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
        <font-awesome-icon
          v-for="p in priorities"
          :key="p"
          :icon="icon('star')"
          class="priority-icon"
          v-bind:class="[{ 'highlighted' :item.priority <= p }, icon]"
          @click.stop="setItemPriority(item, p)" @mouseover="hoverPriority = p" @mouseout="hoverPriority = settings.priority.min + 1"/>
      </span>
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
      let infoUrl = '/list/' + item.media_type + '/' + item.id
      return infoUrl
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
        export: 'Liste exportieren'
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
        export: 'Export list'
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
.label {
  margin-left: 5px;
}
.export {
  margin-bottom: 10px;
}
</style>
