<template>
    <span id="export" class="export" @click="exportList">
      <span><font-awesome-icon :icon="icon('download')"/></span>
      <span class="label">{{ $t('export') }}</span>
    </span>
</template>

<script>
import MetadataMixin from '../mixins/metadata'
import UtilsMixin from '../mixins/utils'
import IconsMixin from '../mixins/icons'

export default {
  name: 'Export',
  mixins: [UtilsMixin, MetadataMixin, IconsMixin],
  props: ['items', 'sort', 'filter'],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    getHeader () {
      let header = this.$t('exportHeader').toUpperCase()
      // header += '\n' + title.replace(/./g, '=')
      header += '\n' + this.$t('statusFilter') + ': ' + this.getStatusFilter()
      header += '\n' + this.$t('priorityFilter') + ': ' + this.getPriorityFilter()
      header += '\n' + this.$t('movieFilter') + ': ' + this.getMovieFilter()
      header += '\n' + this.$t('tvFilter') + ': ' + this.getTvFilter()
      header += '\n' + this.$t('sort') + ': ' + this.getSort()
      header += '\n\n'
      return header
    },
    getStatusFilter () {
      let s = []
      if (this.filter.downloaded && this.filter.queued && this.filter.todo && this.filter.hardToFind && this.filter.notYetAvailable) {
        return this.$t('all')
      }
      if (this.filter.downloaded) {
        s.push(this.$t('downloaded'))
      }
      if (this.filter.queued) {
        s.push(this.$t('queued'))
      }
      if (this.filter.todo) {
        s.push(this.$t('todo'))
      }
      if (this.filter.hardToFind) {
        s.push(this.$t('hardToFind'))
      }
      if (this.filter.notYetAvailable) {
        s.push(this.$t('notYetAvailable'))
      }
      return s.join(', ')
    },
    getPriorityFilter () {
      if (this.filter.priority1 && this.filter.priority2 && this.filter.priority3 && this.filter.priority4 && this.filter.priority5) {
        return this.$t('all')
      }
      let priorities = []
      if (this.filter.priority1 && this.settings.priority.min >= 1) {
        priorities.push('*'.repeat(this.settings.priority.min - 0))
      }
      if (this.filter.priority2 && this.settings.priority.min >= 2) {
        priorities.push('*'.repeat(this.settings.priority.min - 1))
      }
      if (this.filter.priority3 && this.settings.priority.min >= 3) {
        priorities.push('*'.repeat(this.settings.priority.min - 2))
      }
      if (this.filter.priority4 && this.settings.priority.min >= 4) {
        priorities.push('*'.repeat(this.settings.priority.min - 3))
      }
      if (this.filter.priority5 && this.settings.priority.min >= 5) {
        priorities.push('*'.repeat(this.settings.priority.min - 4))
      }
      return priorities.join(', ')
    },
    getMovieFilter () {
      if (this.filter.movie) {
        return this.$t('yes')
      }
      return this.$t('no')
    },
    getTvFilter () {
      if (this.filter.tv) {
        return this.$t('yes')
      }
      return this.$t('no')
    },
    getSort () {
      return this.$t(this.sort)
    },
    getExportData () {
      let content = ''
      this.items.forEach(i => {
        content += this.getTitle(i) + ' (' + this.getReleaseDateFormated(i, 'YYYY') + ')\n'
      })

      return content
    },
    exportList () {
      let date = this.$moment().format('YYYYMMDD_HHmm')
      let fileName = 'export_' + date + '.txt'
      let data = this.getHeader()
      data += this.getExportData()

      let blob = new Blob([data], {type: 'text/plain;charset=utf-8'})
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName)
      } else {
        let elem = window.document.createElement('a')
        elem.href = window.URL.createObjectURL(blob)
        elem.download = fileName
        document.body.appendChild(elem)
        elem.click()
        document.body.removeChild(elem)
      }
    }
  },
  i18n: {
    messages: {
      de: {
        export: 'Liste exportieren',
        exportHeader: 'Download Liste',
        statusFilter: 'Status',
        priorityFilter: 'Priorität',
        movieFilter: 'Filme',
        tvFilter: 'Serien',
        sort: 'Sortierung',
        all: 'Alle',
        notYetAvailable: 'Noch nicht erhältlich',
        hardToFind: 'Noch nicht gefunden',
        queued: 'Wird heruntergeladen',
        todo: 'Todo',
        downloaded: 'Heruntergeladen',
        priority: 'Priorität',
        rating: 'Bewertung',
        title: 'Titel',
        popularity: 'Beliebtheit',
        release: 'Veröffentlichung',
        yes: 'Ja',
        no: 'Nein'
      },
      en: {
        export: 'Export list',
        exportHeader: 'Download list',
        statusFilter: 'Status',
        priorityFilter: 'Priority',
        movieFilter: 'Movies',
        tvFilter: 'TV Series',
        sort: 'Sorting',
        all: 'Any',
        notYetAvailable: 'Not available yet',
        hardToFind: 'Not found yet',
        queued: 'Queued',
        todo: 'Todo',
        downloaded: 'Downloaded',
        priority: 'Priority',
        rating: 'Rating',
        title: 'Title',
        popularity: 'Popularity',
        release: 'Release',
        yes: 'Yes',
        no: 'No'
      }
    }
  }
}
</script>

<style scoped>
.export {
  cursor: pointer;
  color: skyblue;
}
.export:hover {
  color: silver;
}
.label {
  margin-left: 5px;
}
</style>
