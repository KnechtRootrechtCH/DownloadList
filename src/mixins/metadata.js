import Constants from '../constants'

export default {
  computed: {
  },
  methods: {
    isMovie (item) {
      return item && item.media_type === Constants.MEDIA_TYPE.MOVIE
    },
    isTv (item) {
      return item && item.media_type === Constants.MEDIA_TYPE.TV
    },
    isTvSeason (item) {
      return item && item.episode_count !== null
    },
    getTitle (item) {
      if (this.isMovie(item)) {
        return item.title
      } else if (this.isTv(item)) {
        return item.name
      } else if (this.isTvSeason(item)) {
        return item.name
      }
    },
    getOriginalTitle (item) {
      if (this.isMovie(item)) {
        return item.original_title
      } else if (this.isTv(item)) {
        return item.original_name
      }
    },
    getReleaseDateMoment (item) {
      let date = null
      if (this.isMovie(item)) {
        date = item.release_date
      } else if (this.isTv(item)) {
        date = item.first_air_date
      } else if (this.isTvSeason(item)) {
        date = item.air_date
      }
      if (date) {
        let moment = this.$moment(date)
        return moment
      }
      return null
    },
    getReleaseDateFormated (item, format) {
      let moment = this.getReleaseDateMoment(item)
      if (moment) {
        let formated = moment.format(format)
        return formated
      }
      return moment
    },
    getMovieDbUrl (item) {
      let url = 'https://www.themoviedb.org/' + item.media_type + '/' + item.id
      return url
    },
    isAvailableOnNetflix (item) {
      if (item.homepage) {
        return item.homepage.indexOf('www.netflix.com/') > -1
      }
      return false
    },
    getNetflixUrl (item) {
      if (item.homepage && item.homepage.indexOf('www.netflix.com/') > -1) {
        return item.homepage
      }
    },
    getHdArenaSearchUrl (item) {
      let query = this.getSearchString(item)
      return 'http://www.hd-area.org/?s=search&q=' + query
    },
    getMovieBlogSearchUrl (item) {
      let query = this.getSearchString(item)
      return 'http://movie-blog.org/index.php?s=' + query + '&cat=0'
    },
    getSearchString (item) {
      let query = this.getTitle(item)
      query = query.replace(/[-+():;]/gi, '')
      query = query.replace(/ +(?= )/g, '')
      query = query.replace(/\s/g, '+')
      return query
    },
    filterItem (item) {
      if (this.filter === null) {
        return true
      }
      if (!this.filter.movie && this.isMovie(item)) {
        return false
      }
      if (!this.filter.tv && this.isTv(item)) {
        return false
      }

      let selectedItem = this.$store.getters.item(item.key)

      if (!this.filter.downloaded) {
        if (selectedItem && selectedItem.downloaded) {
          return false
        }
      }

      if (!this.filter.queued) {
        if (selectedItem && !selectedItem.downloaded && selectedItem.downloadStatus === 'queued') {
          return false
        }
      }

      if (!this.filter.todo) {
        if (selectedItem && !selectedItem.downloaded && !selectedItem.downloadStatus) {
          let releaseDate = this.getReleaseDateMoment(selectedItem)
          let currentDate = this.$moment()
          if (currentDate > releaseDate) {
            return false
          }
        }
      }

      if (!this.filter.hardToFind) {
        if (selectedItem && !selectedItem.downloaded && selectedItem.downloadStatus === 'hardToFind') {
          return false
        }
      }

      if (!this.filter.notYetAvailable) {
        if (selectedItem && !selectedItem.downloaded && selectedItem.downloadStatus === 'notYetAvailable') {
          return false
        }
        if (selectedItem && !selectedItem.downloaded && !selectedItem.downloadStatus) {
          let releaseDate = this.getReleaseDateMoment(selectedItem)
          let currentDate = this.$moment()
          if (currentDate < releaseDate) {
            return false
          }
        }
      }

      switch (selectedItem.priority) {
        case 1:
          if (!this.filter.priority1) return false
          break
        case 2:
          if (!this.filter.priority2) return false
          break
        case 3:
          if (!this.filter.priority3) return false
          break
        case 4:
          if (!this.filter.priority4) return false
          break
        case 5:
          if (!this.filter.priority5) return false
          break
      }

      if (this.filter.text && this.filter.text.length > 2) {
        let title = this.getTitle(item)
        if (title.toLowerCase().indexOf(this.filter.text.toLowerCase()) !== -1) {
          return true
        }
        let originalTitle = this.getOriginalTitle(item)
        if (originalTitle) {
          return originalTitle.toLowerCase().indexOf(this.filter.text.toLowerCase()) !== -1
        }
        return false
      }

      return true
    },
    sortItem (a, b) {
      if (this.sort === 'priority') {
        if (a.downloaded) return 1
        if (b.downloaded) return -1
        if (a.priority - b.priority !== 0) return a.priority - b.priority
      }
      if (this.sort === 'release') {
        let releaseA = this.getReleaseDateMoment(a)
        let releaseB = this.getReleaseDateMoment(b)
        if (releaseB - releaseA !== 0) return releaseB - releaseA
      }
      if (this.sort === 'rating') {
        if (a.vote_average < b.vote_average) return 1
        if (a.vote_average > b.vote_average) return -1
        return 0
      }
      if (this.sort === 'popularity') {
        if (a.popularity < b.popularity) return 1
        if (a.popularity > b.popularity) return -1
        return 0
      }

      let titleA = this.getTitle(a)
      let titleB = this.getTitle(b)
      if (titleA > titleB) return 1
      if (titleA < titleB) return -1
      return 0
    },
    itemStatusIconName (item) {
      if (item.downloaded) {
        return 'check'
      } else if (this.itemIsQueued(item)) {
        return 'download'
      } else if (this.itemIsHardToFind(item)) {
        return 'spinner'
      } else if (this.itemIsUnreleased(item)) {
        return 'calendar'
      } else if (this.itemIsNotYetAvailable(item)) {
        return 'calendar'
      }
      return 'clock'
    },
    itemIsDownloaded (item) {
      if (!item) {
        return false
      }
      return item.downloaded
    },
    itemIsQueued (item) {
      if (!item) {
        return false
      }
      return item.downloadStatus === 'queued'
    },
    itemIsHardToFind (item) {
      if (!item) {
        return false
      }
      return item.downloadStatus === 'hardToFind'
    },
    itemIsNotYetAvailable (item) {
      if (!item) {
        return false
      }
      return item.downloadStatus === 'notYetAvailable'
    },
    itemIsUnreleased (item) {
      if (!item) {
        return false
      }

      let releaseDate = this.getReleaseDateMoment(item)
      if (!releaseDate) {
        return false
      }

      let currentDate = this.$moment()
      return currentDate < releaseDate
    }
  }
}
