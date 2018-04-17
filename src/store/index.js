import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '../firebase'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Constants from '../constants'
import Helpers from '../helpers'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

export const store = new Vuex.Store({
  state: {
    _movieDbApiKey: '23703a8a857927f41414fb155404393d',
    _movieDbConfiguration: null,
    _locale: 'en',
    _user: null,
    _dataUserId: null,

    _items: {},
    _suggestionDetails: null,
    _suggestionCast: null,
    _suggestionCrew: null,
    _suggestions: {},
    _suggestionsPage: 0,
    _suggestionsPages: 0,
    _suggestionsCount: 0
  },
  mutations: {
    setMovieDbApiKey: (state, payload) => { state._movieDbApiKey = payload },
    setMovieDbConfiguration: (state, payload) => { state._movieDbConfiguration = payload },

    setLocale: state => { state._locale = navigator.language.trim().substring(0, 2) },
    setUser: state => {
      state._user = firebase.authentication.currentUser
      state._dataUserId = firebase.authentication.currentUser.uid
    },
    setDataUserId: (state, uid) => {
      state._dataUserId = uid
    },

    setItems (state, items) { state._items = items },
    resetSuggestions (state) {
      state._suggestionsCount = 0
      state._suggestionsPage = 0
      state._suggestionsPages = 0
      state._suggestions = []
    },
    setSuggestionDetails (state, payload) {
      if (payload) {
        let details = payload.data
        details.media_type = payload.media_type
        details.key = payload.media_type + ':' + details.id
        state._suggestionDetails = details
      } else {
        state._suggestionDetails = null
      }
    },
    setSuggestionCast (state, payload) {
      if (payload) {
        state._suggestionCast = payload.data.cast
      } else {
        state.__suggestionCast = null
      }
    },
    setSuggestionCrew (state, payload) {
      if (payload) {
        state._suggestionCrew = payload.data.crew
      } else {
        state._suggestionCrew = null
      }
    },
    setSuggestionSeason (state, payload) {
      if (payload.data && payload.data.season_number) {
        let index = state._suggestionDetails.seasons.findIndex((s) => {
          return s.season_number === payload.data.season_number
        })
        if (index >= 0) {
          state._suggestionDetails.seasons[index] = payload.data
        }
      }
    },
    setSuggestions (state, payload) {
      state._suggestionsCount = payload.count
      state._suggestionsPage = payload.page
      state._suggestionsPages = payload.pages
      if (payload.page <= 1) {
        state._suggestions = []
      }
      payload.items.forEach(item => {
        if (!item.media_type) {
          item.media_type = payload.media_type
        }
        item.key = item.media_type + ':' + item.id
        if (item.media_type === Constants.MEDIA_TYPE.MOVIE || item.media_type === Constants.MEDIA_TYPE.TV) {
          Vue.set(state._suggestions, item.key, item)
          // state._suggestions[item.key] = item
        } else if (item.media_type === Constants.MEDIA_TYPE.PERSON) {
          item.known_for.forEach(knownFor => {
            knownFor.key = knownFor.media_type + ':' + knownFor.id
            Vue.set(state._suggestions, knownFor.key, knownFor)
            // state._suggestions[knownFor.key] = knownFor
          })
        }
      })
    }
  },
  actions: {
    getMovieDbConfiguration: (context) => {
      let query = 'https://api.themoviedb.org/3/configuration?api_key=' + context.state._movieDbApiKey
      axios.get(query).then(
        (response) => {
          context.commit('setMovieDbConfiguration', response.data)
        }
      )
    },

    getFirebaseData: (context) => {
      firebase.database.ref('settings/movieDbApiKey').on('value', (snapshot) => {
        context.commit('setMovieDbApiKey', snapshot.val())
      })
    },
    getFirebaseUserData: (context) => {
      let dateString = Helpers.getDateString()
      let timeString = Helpers.getTimeString()
      firebase.database.ref('data/' + context.getters.dataUserId + '/access/' + dateString + '/' + timeString).set(new Date().toString())
      firebase.database.ref('data/' + context.getters.dataUserId + '/mail').set(context.getters.user.email)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/').on('value', (snapshot) => {
        context.commit('setItems', snapshot.val())
      })
    },

    transactionLog: (context, payload) => {
      let dateString = Helpers.getDateString()
      let timeString = Helpers.getTimeString()
      firebase.database.ref('data/' + context.getters.dataUserId + '/transactions/' + dateString + '/' + timeString + '-' + payload.action).set(payload)
      firebase.database.ref('data/' + context.getters.dataUserId + '/transaction').set(payload)
    },

    addItem: (context, item) => {
      let transaction = {time: new Date().toString(), action: 'addItem', payload: item, key: item.key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key).set(item)
    },
    updateItem: (context, item) => {
      let transaction = {time: new Date().toString(), action: 'updateItem', payload: item, key: item.key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key).set(item)
    },
    removeItem: (context, key) => {
      let transaction = {time: new Date().toString(), action: 'removeItem', payload: null, key: key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + key).update({
        'priority': Constants.PRIORITY.NONE
      })
    },
    setItemPriority: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'setItemPriority', payload: payload.priority, key: payload.key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + payload.key).update({
        'priority': payload.priority
      })
    },
    addItemComment: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'addItemComment', payload: payload.comment, key: payload.key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + payload.key + '/comments/').push(payload.comment)
    },
    setItemDownloaded: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'setItemDownloaded', payload: payload.downloaded, key: payload.key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + payload.key).update({
        'downloaded': payload.downloaded
      })
    },

    getSuggestions: (context, parameters) => {
      if (context.state._suggestionsPage !== 0 && context.state._suggestionsPage === context.state._suggestionsPages) {
        return
      }

      let query = null
      switch (parameters.queryType) {
        case 'search':
          query = 'https://api.themoviedb.org/3/search/' + parameters.media_type + '?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._suggestionsPage + 1) + '&query=' + parameters.searchString
          break
        case 'popular':
          query = 'https://api.themoviedb.org/3/' + parameters.media_type + '/popular?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._suggestionsPage + 1)
          break
        case 'top_rated':
          query = 'https://api.themoviedb.org/3/' + parameters.media_type + '/top_rated?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._suggestionsPage + 1)
          break
      }

      // console.log(parameters, query)

      axios.get(query).then(
        (response) => {
          if (response.status === 200) {
            context.commit('setSuggestions', {
              'count': response.data.total_results,
              'pages': response.data.total_pages,
              'page': response.data.page,
              'items': response.data.results,
              'media_type': parameters.media_type
            })
          }
        })
    },
    getSuggestionDetails: (context, parameters) => {
      let query = null
      context.commit('setSuggestionDetails', null)
      query = 'https://api.themoviedb.org/3/' + parameters.media_type + '/' + parameters.id + '?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale

      // console.log(parameters, query)

      axios.get(query).then(
        (response) => {
          if (response.status === 200) {
            context.commit('setSuggestionDetails', {
              'data': response.data,
              'media_type': parameters.media_type
            })
          }
        })
    },
    getSuggestionCredits: (context, parameters) => {
      let query = null
      context.commit('setSuggestionCast', null)
      context.commit('setSuggestionCrew', null)
      query = 'https://api.themoviedb.org/3/' + parameters.media_type + '/' + parameters.id + '/credits?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale

      // console.log(parameters, query)

      axios.get(query).then(
        (response) => {
          if (response.status === 200) {
            context.commit('setSuggestionCast', {
              'data': response.data
            })
            context.commit('setSuggestionCrew', {
              'data': response.data
            })
          }
        })
    },
    getSuggestionSeason: (context, parameters) => {
      let query = null
      query = 'https://api.themoviedb.org/3/tv/' + parameters.id + '/season/' + parameters.season_number + '?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale

      // console.log(parameters, query)

      axios.get(query).then(
        (response) => {
          if (response.status === 200) {
            context.commit('setSuggestionSeason', {
              'data': response.data
            })
          }
        })
    }
  },
  getters: {
    test: (state) => { return state._test },
    firebase: (state) => { return state._firebase },
    user: (state) => { return state._user },
    dataUserId: (state) => { return state._dataUserId },

    items: (state) => { return state._items },
    item: (state) => (key) => { return state._items !== null ? state._items[key] : null },
    itemsArray: (state) => {
      let array = []
      for (let key in state._items) {
        let item = state._items[key]
        array.push(item)
      }
      return array
    },

    suggestionDetails: (state) => { return state._suggestionDetails },
    suggestionCast: (state) => { return state._suggestionCast },
    suggestionCrew: (state) => { return state._suggestionCrew },
    suggestions: (state) => { return state._suggestions },
    suggestionsArray: (state) => {
      let array = []
      for (let key in state._suggestions) {
        let item = state._suggestions[key]
        array.push(item)
      }
      return array
    },

    locale: (state) => { return state._locale },
    movieDbApiKey: (state) => { return state._movieDbApiKey },
    movieDbConfiguration: (state) => { return state._movieDbConfiguration }
  }
})
