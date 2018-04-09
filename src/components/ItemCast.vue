<template>
  <div>
    <div class="content" v-if="cast">
      <span class="label">{{ $t('item.cast')}}</span>
      <b-container fluid class="cast-container">
        <transition-group name="cast-grid" tag="div" class="row cast-row">
          <b-col
          v-for="(person) in castFiltered" :key="person.id"
          cols="4" sm="4" md="3" lg="2" xl="2"
          class="cast-item">
            <div class="card border-dark media-card bg-dark text-light" v-on:click.stop="cardClicked(person)">
              <div class="card-img-top">
                <progressive-img v-bind:src="picture(person)" :blur="2"></progressive-img>
              </div>
              <div class="card-body">
                {{ person.name }}
              </div>
            </div>
          </b-col>
        </transition-group>
      </b-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemCast',
  props: ['cast'],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    castFiltered () {
      let filtered = this.cast.filter(c => c.profile_path !== null)
      return filtered
    }
  },
  methods: {
    cardClicked (person) {
      alert(person)
    },
    open (url) {
      var win = window.open(url, '_blank')
      win.focus()
    },
    picture (person) {
      if (person.profile_path) {
        return 'https://image.tmdb.org/t/p/w200' + person.profile_path
      } else {
        return ''
      }
    }
  },
  i18n: {
    messages: {
      de: {
        item: {
          cast: 'Besetzung'
        }
      },
      en: {
        item: {
          cast: 'Cast'
        }
      }
    }
  }
}
</script>

<style scoped>
.label {
  font-weight: bold;
  /* text-transform: uppercase; */
}
.cast-item {
  padding: 0;
}
</style>
