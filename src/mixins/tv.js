export default {
  computed: {
  },
  methods: {
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
    getEpisodeCount (season) {
      let count = 0
      if (season.episodes) {
        count = season.episodes.length
      } else if (season.episode_count) {
        count = season.episode_count
      }
      if (!count) {
        count = 0
      }
      return count
    },
    filterSeasons (seasons, includeSpecials) {
      let filteredSeasons = seasons.filter((s) => s.season_number !== 0)
      let specials = seasons.filter((s) => s.season_number === 0)
      if (includeSpecials && specials && specials.length > 0) {
        return filteredSeasons.concat(specials)
      }
      return filteredSeasons
    }
  }
}
