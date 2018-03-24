<template>
  <div class="card bg-dark text-white suggestion-card" v-bind:class="{ 'suggestion-card-active': !isDownloaded(id) }">
    <progressive-img v-bind:src="getBackdrop(backdrop)" v-bind:placeholder="backdropPlaceholder" :blur="10"></progressive-img>
    <div class="card-img-overlay" v-on:click.stop="toggleItem(index, id)">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text">{{ getReleaseYear(releaseDate) }}</p>
      <div class="info-icons">
        <font-awesome-icon :icon="infoIcon" class="info-icon" v-on:click.stop="openInformationUrl(id)"/>
      </div>
      <div class="toggle-icons" v-if="isDownloaded(id)">
        <font-awesome-icon :icon="checkIcon" class="toggle-icon check-icon"/>
      </div>
      <div class="toggle-icons" v-if="!isDownloaded(id) && isSelected(id)">
        <font-awesome-icon :icon="minusIcon" class="toggle-icon priority-icon-active" v-on:click.stop="toggleItem(index, id)"/>
        <font-awesome-icon :icon="exclamationIcon" class="toggle-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(id, 3) }" v-on:click.stop="setPriority(id, 3)"/>
        <font-awesome-icon :icon="exclamationIcon" class="toggle-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(id, 2) }" v-on:click.stop="setPriority(id, 2)"/>
        <font-awesome-icon :icon="exclamationIcon" class="toggle-icon priority-icon" v-bind:class="{ 'priority-icon-active': hasPriority(id, 1) }" v-on:click.stop="setPriority(id, 1)"/>
      </div>
      <div class="toggle-icons" v-if="!isDownloaded(id) && !isSelected(id)">
        <font-awesome-icon :icon="plusIcon" class="toggle-icon add-icon"/>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faExclamationCircle from '@fortawesome/fontawesome-free-solid/faExclamationCircle'
import faMinusCircle from '@fortawesome/fontawesome-free-solid/faMinusCircle'
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle'
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'

export default {
  name: 'SuggestionItem',
  props: ['suggestionType', 'index', 'id', 'title', 'releaseDate', 'backdrop'],
  data () {
    return {
    }
  },
  components: {
    FontAwesomeIcon
  },
  computed: {
    minusIcon () {
      return faMinusCircle
    },
    plusIcon () {
      return faPlusCircle
    },
    exclamationIcon () {
      return faExclamationCircle
    },
    checkIcon () {
      return faCheckCircle
    },
    infoIcon () {
      return faInfoCircle
    },
    backdropPlaceholder () {
      if (this.suggestionType === 'movie') {
        return this.$store.getters.fallbackMovieBackdrop
      } else if (this.suggestionType === 'tv') {
        return this.$store.getters.fallbackTvBackdrop
      }
    }
  },
  methods: {
    openInformationUrl (id) {
      var url = this.getInfoUrl(id)
      var win = window.open(url, '_blank')
      win.focus()
    },
    getBackdrop (path) {
      if (path) {
        return 'https://image.tmdb.org/t/p/w500' + path
      } else if (this.suggestionItem === 'movie') {
        return this.$store.getters.fallbackMovieBackdrop
      } else if (this.suggestionType === 'tv') {
        return this.$store.getters.fallbackTvBackdrop
      }
    },
    getInfoUrl (id) {
      if (id) {
        return 'https://www.themoviedb.org/' + this.suggestionType + '/' + id
      } else {
        return 'https://www.themoviedb.org/' + this.suggestionType + '/'
      }
    },
    getReleaseYear (date) {
      if (date) {
        return date.substring(0, 4)
      } else {
        return ''
      }
    },
    toggleItem (index, id) {
      if (this.suggestionType === 'movie') {
        this.toggleMovie(index, id)
      } else if (this.suggestionType === 'tv') {
        this.toggleTv(index, id)
      }
    },
    toggleMovie (index, id) {
      var item = this.getItem(id)
      if (item) {
        if (item.downloaded) {
          return
        }
        this.$store.dispatch('removeMovie', item.id)
      } else {
        item = this.$store.getters.movieSuggestions[index]
        item.priority = 4
        this.$store.dispatch('addMovie', item)
      }
    },
    toggleTv (index, id) {
      var item = this.getItem(id)
      if (item) {
        if (item.downloaded) {
          return
        }
        this.$store.dispatch('removeTv', item.id)
      } else {
        item = this.$store.getters.tvSuggestions[index]
        item.priority = 4
        this.$store.dispatch('addTv', item)
      }
    },
    getItem (id) {
      if (this.suggestionType === 'movie') {
        return this.$store.getters.movie(id)
      } else if (this.suggestionType === 'tv') {
        return this.$store.getters.tv(id)
      }
    },
    isSelected (id) {
      var item = this.getItem(id)
      return item
    },
    isDownloaded (id) {
      var item = this.getItem(id)
      if (item) {
        return item.downloaded
      }
      return false
    },
    hasPriority (id, priority) {
      var item = this.getItem(id)
      if (item) {
        return item.priority <= priority
      }
      return false
    },
    setPriority (id, p) {
      if (this.suggestionType === 'movie') {
        this.setMoviePriority(id, p)
      } else if (this.suggestionType === 'tv') {
        this.setTvPriority(id, p)
      }
    },
    setMoviePriority (id, p) {
      var item = this.getItem(id)
      var priority = p
      if (item) {
        if (item.priority === priority) {
          priority++
        }

        if (priority >= 5) {
          this.$store.dispatch('removeMovie', item.id)
        } else {
          this.$store.dispatch('setMoviePriority', {
            id: item.id,
            priority: priority})
        }
      }
    },
    setTvPriority (id, p) {
      var item = this.getItem(id)
      var priority = p
      if (item) {
        if (item.priority === priority) {
          priority++
        }

        if (priority >= 5) {
          this.$store.dispatch('removeTv', item.id)
        } else {
          this.$store.dispatch('setTvPriority', {
            id: item.id,
            priority: priority})
        }
      }
    }
  },
  i18n: {
    messages: {
      de: {
        suggestionItem: {
          released: 'Veröffentlicht'
        }
      },
      en: {
        suggestionItem: {
          released: 'Released'
        }
      }
    }
  }
}
</script>

<style scoped>
.suggestion-card {
  background-color: #343a40;
  margin: 0 10px 10px 0;
  transition: transform .5s; /* Animation */
}
.suggestion-card:hover {
  z-index: 100;
  transform: scale(1.1); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
}
.suggestion-card-active {
  cursor: pointer;
}
h5.card-title {
  margin-bottom: 4px;
}
div.toggle-icons {
  position: absolute;
  height: 30px;
  right: 15px;
  bottom: 15px;
}
div.info-icons {
  position: absolute;
  height: 30px;
  left: 15px;
  bottom: 15px;
}
.info-icon {
  color: white;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.add-icon {
  color: white;
}
.check-icon {
  color: limegreen;
}
.toggle-icon {
  width: 30px;
  height: 30px;
}
.priority-icon {
  opacity: 0.4;
}
.priority-icon-active {
    opacity: 1;
    color: white;
}
.card-img-overlay {
  z-index: 10;
  padding: 15px;
}
</style>
