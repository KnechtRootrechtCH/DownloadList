import Constants from '../constants'

export default {
  computed: {
    constants () {
      return Constants
    },
    priorities () {
      let priorities = []
      for (let i = this.constants.PRIORITY.MIN; i >= this.constants.PRIORITY.MAX; i--) {
        priorities.push(i)
      }
      return priorities
    }
  },
  methods: {
    openUrl (url, target) {
      let win = window.open(url, '_blank')
      win.focus()
    },
    routeTo (target) {
      this.$router.push({
        path: target
      })
    },
    isMovie (item) {
      return item && item.media_type === this.constants.MEDIA_TYPE.MOVIE
    },
    isTv (item) {
      return item && item.media_type === this.constants.MEDIA_TYPE.TV
    },
    getTitle (item) {
      if (this.isMovie(item)) {
        return item.title
      } else if (this.isTv(item)) {
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
      }
      if (date) {
        let moment = this.$moment(date)
        return moment
      }
    },
    getReleaseDateFormated (item, format) {
      let moment = this.getReleaseDateMoment(item)
      if (moment) {
        let formated = moment.format(format)
        return formated
      }
      return moment
    },
    destroyTooltips () {
      // quite a hack, but works
      let tooltips = document.getElementsByClassName('tooltip')
      for (let i = tooltips.length - 1; i >= 0; i--) {
        // Remove first element (at [0]) repeatedly
        tooltips[0].parentNode.removeChild(tooltips[0])
      }
    },
    getBackdrop (item, size) {
      if (this.item.backdrop_path) {
        return 'https://image.tmdb.org/t/p/' + size + item.backdrop_path
      }
    },
    getBackdropPlaceholder (mediaType) {
      if (mediaType === this.constants.MEDIA_TYPE.MOVIE) {
        return this.$store.getters.fallbackMovieBackdrop
      } else if (mediaType === this.constants.MEDIA_TYPE.TV) {
        return this.$store.getters.fallbackTvBackdrop
      }
    },
    getMovieDbUrl (mediaType, id) {
      let url = 'https://www.themoviedb.org/' + mediaType + '/' + id
      return url
    },
    isAvailableOnNetflix (item) {
      if (item.homepage) {
        return item.homepage.includes('www.netflix.com/')
      }
      return false
    },
    getNetflixUrl (item) {
      if (item.homepage && item.homepage.includes('www.netflix.com/')) {
        return item.homepage
      }
    },
    setPriority (key, priority) {
      this.$store.dispatch('setItemPriority', {
        key: key,
        priority: priority})
    },
    setDownloaded (key, downloaded) {
      if (this.item) {
        this.$store.dispatch('setItemDownloaded', {
          key: this.item.key,
          downloaded: downloaded})
      }
    },
    addItem (item, mediaType) {
      item.priority = this.constants.PRIORITY.DEFAULT
      if (!item.key) {
        if (mediaType) {
          item.key = mediaType + ':' + item.id
        } else if (item.media_type) {
          item.key = item.media_type + ':' + item.id
        } else {
          this.$warn('Unable to generate key for item', item)
        }
      }
      this.$store.dispatch('updateItem', item)
    },
    removeItem (key) {
      this.setPriority(key, this.constants.PRIORITY.NONE)
    }
  }
}
