<template>
  <div>
    <div id="export" class="export" @click="exportText">
      <span><font-awesome-icon :icon="icon('word')"/></span>
      <span class="label">{{ $t('exportFile') }}</span>
    </div>
    <div id="export" class="export" @click="exportCsv">
      <span><font-awesome-icon :icon="icon('excel')"/></span>
      <span class="label">{{ $t('exportCsv') }}</span>
    </div>
  </div>
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
    exportCsv () {
      let date = this.$moment().format('YYYYMMDD_HHmm')
      let fileName = 'export_' + date + '.csv'
      let data = this.getCsvHeader()
      data += this.getCsvContent()

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
    },
    getCsvHeader () {
      let cols = []
      cols.push(this.wrap(this.$t('title')))
      cols.push(this.wrap(this.$t('status')))
      cols.push(this.wrap(this.$t('release')))
      cols.push(this.wrap(this.$t('genres')))
      cols.push(this.wrap(this.$t('director')))
      for (let i = 0; i < this.constants.CAST_DISPLAY_COUNT; i++) {
        cols.push(this.wrap(this.$t('actor') + ' ' + (i + 1)))
      }

      return cols.join(this.settings.csvDelimeter)
    },
    getCsvContent () {
      let content = ''
      this.items.forEach(i => {
        content += '\n'
        content += this.getCsvRow(i)
      })

      return content
    },
    getCsvRow (item) {
      let cells = [
        this.wrap(this.getTitle(item)),
        this.wrap(this.status(item)),
        this.wrap(this.getReleaseDateFormated(item, 'YYYY')),
        this.wrap(this.genres(item)),
        this.wrap(item.director)
      ]

      let cast = []
      if (item.cast) {
        cast = item.cast.split(',')
      }

      for (let i = 0; i < this.constants.CAST_DISPLAY_COUNT; i++) {
        if (i < cast.length) {
          cells.push(this.wrap(cast[i].trim()))
        } else {
          cells.push(this.wrap('-'))
        }
      }
      return cells.join(this.settings.csvDelimeter)
    },
    exportText () {
      let date = this.$moment().format('YYYYMMDD_HHmm')
      let fileName = 'export_' + date + '.txt'
      let data = this.getTextHeader()
      data += this.getTextContent()

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
    },
    getTextHeader () {
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
    getTextContent () {
      let content = ''
      this.items.forEach(i => {
        content += this.getTitle(i) + ' (' + this.getReleaseDateFormated(i, 'YYYY') + ')\n'
        if (this.settings.showStatusOnList) {
          content += this.$t('status') + ': ' + this.status(i) + '\n'
        }
        if (this.settings.showGenresOnList) {
          content += this.$t('genres') + ': ' + this.genres(i) + '\n'
        }
        if (this.settings.showDirectorOnList) {
          content += this.$t('director') + ': ' + i.director + '\n'
        }
        if (this.settings.showCastOnList) {
          content += this.$t('cast') + ': ' + i.cast + '\n'
        }
        if (this.settings.showDirectorOnList || this.settings.showCastOnList || this.settings.showGenresOnList || this.settings.showStatusOnList) {
          content += '\n'
        }
      })

      return content
    },
    genres (item) {
      let genres = item.genres
      if (genres === null) {
        return '-'
      }

      let names = genres.map(x => x.name)

      return names.join(', ')
    },
    status (item) {
      let status = item.downloadStatus
      if (status) {
        return this.$t(status)
      } else {
        return this.$t('todo')
      }
    },
    wrap (text) {
      return `"${text}"`
    }
  },
  i18n: {
    messages: {
      de: {
        exportFile: 'Als Text-Liste exportieren',
        exportCsv: 'Als CSV-Tabelle exportieren',
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
        no: 'Nein',
        director: 'Regie',
        cast: 'Besetzung',
        actor: 'Schauspieler',
        genres: 'Genres',
        status: 'Status'
      },
      en: {
        exportFile: 'Export to text file',
        exportCsv: 'Export to csv file',
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
        no: 'No',
        director: 'Director',
        cast: 'Cast',
        actor: 'Actor',
        genres: 'Genres',
        status: 'Status'
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
