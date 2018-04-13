<template>
  <b-list-group-item class="season" variant="dark">

    <span class="label">{{ season.name }}</span>
    <div class="air-date">
      <span class="episodes">Aired {{ airDate }}</span>
    </div>
    <div class="download-status">
      <span class="episodes">0/{{ season.episode_count }} downloaded</span>
      <font-awesome-icon
      :icon="icon('exclamation')"
      class="icon todo"/>
    </div>
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
</template>

<script>
import IconsMixin from '../../mixins/icons'

export default {
  name: 'ItemSeason',
  props: ['item', 'season'],
  mixins: [IconsMixin],
  data () {
    return {
      filterSpecials: true
    }
  },
  components: {
  },
  computed: {
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
  },
  i18n: {
    messages: {
      de: {
        item: {

          season: {
            airDate: 'Ausstrahlung',
            episodes: 'Episoden'
          }
        }
      },
      en: {
        item: {
          season: {
            airDate: 'Air Date',
            episodes: 'Episodes'
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
.season .download-status {
  /* float: right; */
}
.season .icon {
  width: 18px;
  height: 18px;
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
