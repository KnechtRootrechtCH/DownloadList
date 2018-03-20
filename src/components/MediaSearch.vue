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
        v-bind:placeholder="inputPlaceholder"
        type="amazon">
      </vue-instant>

      <label>{{selectedEvent}}</label>
    </div>
</template>

<script>
export default {
  name: 'MediaSearch',
  props: ['mediaType', 'suggestionField', 'inputPlaceholder'],
  data () {
    return {
      value: '',
      suggestionAttribute: this.suggestionField,
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
      this.selectedEvent = 'changed'
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
