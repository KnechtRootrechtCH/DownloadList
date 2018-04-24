<template>
  <b-col cols="12">
    <b-card no-body bg-variant="dark" border-variant="dark">
      <b-card-header
              header-bg-variant="dark"
              header-border-variant="secondary"
              header-text-variant="faded"
              v-bind:class="{ 'clickable': isSelected }"
              @click="toggle">
        <span class="title">
          <span class="number">{{ episode.season_number }}x{{ episodeNumber }}</span>&nbsp;
          <span class="name">{{ episode.name }}</span>
          <span class="actions">
            <font-awesome-icon
              v-if="isDownloaded"
              :icon="icon('check')"
              class="icon done"/>
            <font-awesome-icon
              v-if="!isDownloaded && isSelected"
              :icon="icon('exclamation')"
              class="icon"/>
          </span>
        </span>
      </b-card-header>
      <b-card-body class="card-text"
              body-text-variant="dark">
        <progressive-img class="still" v-bind:src="still" :blur="10"></progressive-img>
        <div>
          <div class="air-date">{{ airDate }}</div>
          <div class="overview">{{ episode.overview }}</div>
        </div>
      </b-card-body>
    </b-card>
  </b-col>
</template>

<script>
import UtilsMixin from '../../mixins/utils'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'ItemEpisode',
  props: ['id', 'item', 'episode'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
    }
  },
  components: {

  },
  computed: {
    isSelected () {
      return this.item && this.item.priority > 0
    },
    isDownloaded () {
      let episodeDownloaded = this.getEpisodeDownloadState(this.item, this.episode.season_number, this.episode.episode_number)
      return this.isSelected && episodeDownloaded
    },
    airDate () {
      if (this.episode.air_date) {
        let moment = this.$moment(this.episode.air_date)
        let formated = moment.format('DD.MM.YYYY')
        return formated
      } else {
        return ''
      }
    },
    still () {
      return this.getStillImage(this.episode, this.constants.IMAGESIZE.STILL.W185)
    },
    stillFallback () {
      return this.getStillPlaceholder(this.constants.IMAGESIZE.STILL.W144)
    },
    episodeNumber () {
      return this.utils.padNumber(this.episode.episode_number, 2)
    }
  },
  methods: {
    toggle () {
      if (!this.isSelected) {
        return
      }
      this.updateEpisodeDownloadState(this.item.id, this.episode.season_number, this.episode.episode_number, !this.isDownloaded)
    }
  },
  i18n: {
    messages: {
      de: {
        episode: {
          airDate: 'Ausstrahlung'
        }
      },
      en: {
        episode: {
          airDate: 'Air date'
        }
      }
    }
  }
}
</script>

<style scoped>
*:focus {
  outline: none;
}
.card {
  margin-bottom: 10px;
}
.card-body {
  padding: 12px 20px 12px 20px;
  background-color: #f0f0f0;
}
.card-header.clickable {
  cursor: pointer;
}
.title {
  font-weight: bold;
}
.still {
  float: left;
  margin: 0 10px 0 0;
  width: 150px;
  border-color: #6c757d;
  border-style: solid;
}
.air-date {
  font-weight: bold;
}
.actions {
  float: right;
}
.actions .icon {
  width: 20px;
  height: 20px;
}
.actions .icon.done {
  width: 20px;
  height: 20px;
  color: limegreen;
}
</style>
