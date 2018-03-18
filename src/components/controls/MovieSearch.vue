<template>
    <div class="movie-search">
      <vue-instant :suggestion-attribute="suggestionAttribute"
        v-model="value"
        :disabled="false"
        :show-autocomplete="true"
        :autofocus="false"
        :suggestions="suggestions"
        @input="changed"
        @click-input="clickInput"
        @click-button="clickButton"
        @selected="selected"
        @enter="enter"
        @key-up="keyUp"
        @key-down="keyDown"
        @key-right="keyRight"
        @clear="clear"
        @escape="escape"
        name="customName"
        placeholder="Film suchen…"
        type="amazon">
      </vue-instant>

      <label>{{selectedEvent}}</label>
    </div>
</template>

<script>
import {globalStore} from '../../main.js'

export default {
  name: 'MovieSearch',
  data () {
    return {
      value: '',
      suggestionAttribute: 'title',
      suggestions: [],
      selectedEvent: ''
    }
  },
  methods: {
    clickInput: function () {
      this.selectedEvent = 'click input'
    },
    clickButton: function () {
      this.selectedEvent = 'click button'
    },
    selected: function () {
      this.selectedEvent = 'selection changed'
    },
    enter: function () {
      this.selectedEvent = 'enter'
    },
    keyUp: function () {
      this.selectedEvent = 'keyup pressed'
    },
    keyDown: function () {
      this.selectedEvent = 'keyDown pressed'
    },
    keyRight: function () {
      this.selectedEvent = 'keyRight pressed'
    },
    clear: function () {
      this.selectedEvent = 'clear input'
    },
    escape: function () {
      this.selectedEvent = 'escape'
    },
    changed: function () {
      var that = this
      this.suggestions = []
      this.axios.get('https://api.themoviedb.org/3/search/movie?api_key=' + globalStore.movieDbApiKey + '&language=de&query=' + this.value)
        .then(function (response) {
          response.data.results.forEach(function (a) {
            that.suggestions.push(a)
          })
        })
    }
  }
}
</script>
  
<style scoped>
  .movie-search {
    margin: 20px;
    padding: 20px;
  }
</style>
