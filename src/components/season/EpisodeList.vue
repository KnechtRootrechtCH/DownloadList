<template>
  <div>
    <b-list-group flush>
      <episode v-for="episode in season.episodes" :key="episode.id" v-bind:id="episode.id" v-bind:item="item" v-bind:episode="episode"></episode>
    </b-list-group>
  </div>
</template>

<script>
import IconsMixin from '../../mixins/icons'
import Episode from './Episode'

export default {
  name: 'EpisodeList',
  props: ['item', 'season'],
  mixins: [IconsMixin],
  data () {
    return {
      expanded: false
    }
  },
  components: {
    'episode': Episode
  },
  computed: {
  },
  methods: {
  },
  i18n: {
    messages: {
      de: {
        item: {
          season: {
          }
        }
      },
      en: {
        item: {
          season: {
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
