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
    }
  }
}
