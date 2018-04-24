import Constants from '../constants'
import Utils from '../helpers'

export default {
  computed: {
    constants () {
      return Constants
    },
    utils () {
      return Utils
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
    getBackdropImage (item, size) {
      if (item && item.backdrop_path) {
        return this.getMovieDbImage(item.backdrop_path, size)
      } else {
        return this.getBackdropPlaceholder(size)
      }
    },
    getProfileImage (person, size) {
      if (person && person.profile_path) {
        return this.getMovieDbImage(person.profile_path, size)
      } else {
        return this.getProfilePlaceholder(size)
      }
    },
    getPosterImage (item, size) {
      if (item && item.poster_path) {
        return this.getMovieDbImage(item.poster_path, size)
      } else {
        return this.getPosterPlaceholder(size)
      }
    },
    getStillImage (item, size) {
      if (item && item.still_path) {
        return this.getMovieDbImage(item.still_path, size)
      } else {
        return this.getStillPlaceholder(size)
      }
    },
    getMovieDbImage (path, size) {
      return 'https://image.tmdb.org/t/p/' + size.key + path
    },
    getBackdropPlaceholder (size) {
      return this.getPlaceholderImage(size, '+', '444499', 'ededed')
    },
    getProfilePlaceholder (size) {
      return this.getPlaceholderImage(size, '??', '444499', 'ededed')
    },
    getStillPlaceholder (size) {
      return this.getPlaceholderImage(size, '??', '444499', 'ededed')
    },
    getPosterPlaceholder (size) {
      return this.getPlaceholderImage(size, '+', '495057', 'ededed')
    },
    getPlaceholderImage (size, text, background, textColor) {
      // https://dummyimage.com/200x300/CC0000/ffffff&text=dummyimage.com+rocks!
      return 'https://dummyimage.com/' + size.width + 'x' + size.height + '/' + background + '/' + textColor + '&text=' + text
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
    setPriority (key, priority) {
      this.$store.dispatch('setItemPriority', {
        key: key,
        priority: priority})
    },
    setDownloaded (item, downloaded, seasons) {
      if (!this.isTv(item)) {
        this.$store.dispatch('setItemDownloaded', {
          key: item.key,
          downloaded: downloaded})
      } else if (seasons) {
        this.setAllSeasonsDownloaded(item, seasons, downloaded)
      } else {
        this.$error('Unable to set downloaded state for item ' + item.key + '! Please provide seasons list')
      }
    },
    setAllSeasonsDownloaded (item, seasons, downloaded) {
      this.$store.dispatch('setSeasonsDownloaded', {
        itemId: item.id,
        seasons: seasons,
        downloaded: downloaded
      })
    },
    setSeasonDownloaded (item, season, downloaded) {
      this.$store.dispatch('setSeasonDownloaded', {
        itemId: item.id,
        season: season.season_number,
        episodeCount: this.episodeCount(season),
        downloaded: downloaded
      })
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
      this.$store.dispatch('addItem', item)
    },
    removeItem (key) {
      this.$store.dispatch('removeItem', key)
    },
    getSeasonDownloadStates (item, seasonNumber) {
      if (!item || !item.downloadedEpisodes) {
        return null
      }
      return item.downloadedEpisodes[seasonNumber]
    },
    getEpisodeDownloadState (item, seasonNumber, episodeNumber) {
      let season = this.getSeasonDownloadStates(item, seasonNumber)
      if (!season) {
        return null
      }
      let episode = season[episodeNumber]
      return episode && episode.downloaded
    },
    getEpisodeDownloadCount (item, seasonNumber) {
      let season = this.getSeasonDownloadStates(item, seasonNumber)
      if (!season) {
        return 0
      }
      let count = 0
      season.forEach((s) => {
        if (s.downloaded) {
          count++
        }
      })
      return count
    },
    updateEpisodeDownloadState (itemId, seasonNumber, episodeNumber, downloaded) {
      this.$store.dispatch('setEpisodeDownloaded', {
        itemId: itemId,
        season: seasonNumber,
        episode: episodeNumber,
        downloaded: downloaded})
    },
    episodeCount (season) {
      if (season.episode_count) {
        return season.episode_count
      } else if (season.episodes) {
        return season.episodes.length
      }
    },
    downloadedCount (season) {
      let count = this.getEpisodeDownloadCount(this.item, season.season_number)
      if (!count) {
        return 0
      }
      return count
    }
  }
}
