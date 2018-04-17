<template>
  <div>
    <b-card no-body class="season" bg-variant="dark" v-if="season">
      <b-card-header header-tag="header" class="season-header" @click="expanded = !expanded">
        <span class="label">{{ season.name }}</span>
        <!--<span class="episodes"> (0/{{ episodeCount }}<span class="d-none d-md-inline">&nbsp;{{ $t('item.season.downloaded')}}</span>)</span>-->
        <span class="actions">
          <!--
          <font-awesome-icon
            :icon="icon('check')"
            @click="toggleSeason"
            class="icon todo"/>-->
          <font-awesome-icon
            :icon="icon(chevronIcon)"
            class="icon"/>
        </span>
      </b-card-header>
      <b-collapse v-model="expanded" v-bind:id="'season-collpase-' + season.season_number">
        <b-list-group flush>
          <episode v-for="episode in season.episodes" :key="episode.id" v-bind:id="id" v-bind:item="item" v-bind:episode="episode"></episode>
        </b-list-group>
        <!--<episode-list v-bind:id="id" v-bind:item="item" v-bind:episodes="season.episodes"></episode-list>-->
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
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import IconsMixin from '../../mixins/icons'
import ItemEpisode from './Episode'

export default {
  name: 'ItemSeason',
  props: ['id', 'item', 'seasonNumber'],
  mixins: [IconsMixin],
  data () {
    return {
      expanded: false
    }
  },
  components: {
    'episode': ItemEpisode
  },
  computed: {
    season () {
      let season = this.$store.getters.suggestionSeason(this.seasonNumber)
      return season
    },
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
      'season_number': this.seasonNumber
    })
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
  /*
  font-size: 18px;
  border-color: #f0f0f0;
  background-color: darkgrey;
  color: black;
  border-style: solid;
  border-width: 2px;
  border-radius: 0;
  margin-bottom: 5px;
  */
}
.season .poster {
  width: 150px;
}
.season .info-section {
  float: right;
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
.season .icon.done {
  color: green;
}
</style>
