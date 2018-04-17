<template>
  <div>
    <b-list-group-item class="season" variant="dark" @click="expanded = !expanded">
      <span class="label">{{ season.name }}</span>
      <span class="episodes"> (0/{{ episodeCount }}<span class="d-none d-md-inline">&nbsp;{{ $t('item.season.downloaded')}}</span>)</span>
      <span class="actions">
        <font-awesome-icon
          :icon="icon('check')"
          @click="toggleSeason"
          class="icon todo"/>
        <font-awesome-icon
          :icon="icon(chevronIcon)"
          class="icon"/>
      </span>
      <!--
      <div class="poster-section">
        <progressive-img class="poster" v-bind:src="poster" :blur="10"></progressive-img>
      </div>
      <div class="content-section">
        <h5 class="label">{{ season.name }}</h5>
        <div class="content"><span class="label">{{ $t('item.season.airDate')}}:&nbsp;</span>{{ airDate }}</div>
        <div class="content"><span class="label">{{ $t('item.season.episodes')}}:&nbsp;</span>{{ season.episode_count }}</div>
      </div>
      -->
    </b-list-group-item>
  </div>
</template>

<script>
import IconsMixin from '../../mixins/icons'
import ItemEpisodeList from './EpisodeList'

export default {
  name: 'ItemSeason',
  props: ['id', 'item', 'season'],
  mixins: [IconsMixin],
  data () {
    return {
      expanded: false
    }
  },
  components: {
    'episode-list': ItemEpisodeList
  },
  computed: {
    chevronIcon () {
      if (this.expanded) {
        return 'chevron-up'
      } else {
        return 'chevron-down'
      }
    },
    episodeCount () {
      if (this.season.episode_count) {
        return this.season.episode_count
      } else if (this.season.episodes) {
        return this.season.episodes.length
      }
    },
    poster () {
      if (this.season.poster_path) {
        return 'https://image.tmdb.org/t/p/w185' + this.season.poster_path
      } else {
        return ''
      }
    },
    airDate () {
      if (this.season.air_date) {
        let moment = this.$moment(this.season.air_date)
        let formated = moment.format('DD.MM.YYYY')
        return formated
      } else {
        return ''
      }
    }
  },
  methods: {
    toggleSeason () {
      console.log('toggle season')
    }
  },
  created () {
    this.$store.dispatch('getSuggestionSeason', {
      'id': this.id,
      'season_number': this.season.season_number
    })
    if (this.season.season_number === 1) {
      this.expanded = true
    }
  },
  i18n: {
    messages: {
      de: {
        item: {

          season: {
            airDate: 'Ausstrahlung',
            episodes: 'Episoden',
            downloaded: 'heruntergeladen'
          }
        }
      },
      en: {
        item: {
          season: {
            airDate: 'Air Date',
            episodes: 'Episodes',
            downloaded: 'downloaded'
          }
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
.clickable {
  cursor: pointer;
}
.season {
  font-size: 18px;
  border-color: #f0f0f0;
  background-color: darkgrey;
  color: black;
  border-style: solid;
  border-width: 2px;
  border-radius: 0;
  margin-bottom: 5px;
}
.season .label {
  text-transform: uppercase;
}
.season .actions {
  float: right;
}
.season .icon {
  width: 20px;
  height: 20px;
}
.season .icon.todo {
  color: darkred;
}
.season .icon.in-progress {
  color: black;
}
.season .icon.done {
  color: green;
}
</style>
