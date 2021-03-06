export default {
  computed: {
  },
  methods: {
    addItem (item, mediaType) {
      item.priority = this.$store.getters.settings.priority.default
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
    setPriority (key, priority) {
      this.$store.dispatch('setItemPriority', {
        key: key,
        priority: priority})
    },
    setDownloaded (item, downloaded, seasons) {
      if (downloaded) {
        this.$store.dispatch('setItemDownloadStatus', {
          key: item.key,
          status: 'downloaded'})
      } else {
        this.$store.dispatch('setItemDownloadStatus', {
          key: item.key,
          status: null})
      }
      this.$store.dispatch('setItemDownloaded', {
        key: item.key,
        downloaded: downloaded})
    },
    setStatus (item, status) {
      this.$store.dispatch('setItemDownloadStatus', {
        key: item.key,
        status: status})
    },
    setAllSeasonsDownloaded (item, seasons, downloaded) {
      this.$store.dispatch('setSeasonsDownloaded', {
        itemId: item.id,
        seasons: seasons,
        downloaded: downloaded
      })
    },
    setSeasonDownloaded (item, season, downloaded) {
      let episodeCount = 0
      if (season.episodes) {
        episodeCount = season.episodes.length
      } else if (season.episode_count) {
        episodeCount = season.episode_count
      }
      if (!episodeCount) {
        episodeCount = 0
      }
      this.$store.dispatch('setSeasonDownloaded', {
        itemId: item.id,
        season: season.season_number,
        episodeCount: episodeCount,
        downloaded: downloaded
      })
    },
    updateEpisodeDownloadState (itemId, seasonNumber, episodeNumber, downloaded) {
      this.$store.dispatch('setEpisodeDownloaded', {
        itemId: itemId,
        season: seasonNumber,
        episode: episodeNumber,
        downloaded: downloaded})
    }
  }
}
