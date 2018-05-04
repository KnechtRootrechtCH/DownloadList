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
    _settings: {
      movieDbApiKey: '23703a8a857927f41414fb155404393d',
      priority: {
        min: 3,
        max: 1,
        default: 2,
        none: 0
      }
    },
    _movieDbConfiguration: null,
    _locale: 'en',
    _user: null,
    _userSettings: null,
    _dataUserId: null,
    _loading: false,

    _items: {},
    _comments: [],
    _suggestionDetails: null,
    _suggestionSeasons: {},
    _suggestions: {},
    _suggestionsPage: 0,
    _suggestionsPages: 0,
    _suggestionsCount: 0
  },
  mutations: {
    setSettings: (state, payload) => { state._settings = payload },
    setMovieDbConfiguration: (state, payload) => { state._movieDbConfiguration = payload },

    setLocale: state => { state._locale = navigator.language.trim().substring(0, 2) },
    setUser: state => {
      if (firebase.authentication && firebase.authentication.currentUser) {
        state._user = firebase.authentication.currentUser
        state._dataUserId = firebase.authentication.currentUser.uid
      } else {
        state._user = null
        state._dataUserId = null
      }
    },
    setUserSettings: (state, payload) => {
      state._userSettings = payload
    },
    setDataUserId: (state, uid) => {
      state._dataUserId = uid
    },
    setLoading: (state, loading) => { state._loading = loading },

    setItems: (state, items) => { state._items = items },
    setComments: (state, comments) => { state._comments = comments },
    resetSuggestions: (state) => {
      state._suggestionsCount = 0
      state._suggestionsPage = 0
      state._suggestionsPages = 0
      state._suggestions = []
    },
    setSuggestionDetails: (state, payload) => {
      if (payload) {
        let details = payload.data
        details.media_type = payload.media_type
        details.key = payload.media_type + ':' + details.id
        details.details = true
        state._suggestionDetails = details
      } else {
        state._suggestionDetails = null
      }
    },
    setSuggestionSeason: (state, payload) => {
      if (payload.data && payload.data.season_number >= 0) {
        // state._suggestionSeasons.set('season_' + payload.data.season_number, payload.data)
        Vue.set(state._suggestionSeasons, 'season_' + payload.data.season_number, payload.data)
      }
    },
    setSuggestions: (state, payload) => {
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
      let query = 'https://api.themoviedb.org/3/configuration?api_key=' + context.state._settings.movieDbApiKey
      axios.get(query).then(
        (response) => {
          context.commit('setMovieDbConfiguration', response.data)
        }
      )
    },

    getFirebaseSettings: (context) => {
      firebase.database.ref('settings').on('value', (snapshot) => {
        context.commit('setSettings', snapshot.val())
      })
    },
    getFirebaseUserData: (context) => {
      let dateString = Helpers.getDateString()
      let timeString = Helpers.getTimeString()
      firebase.database.ref('data/' + context.getters.user.uid + '/access/' + dateString + '/' + timeString).set(new Date().toString())
      firebase.database.ref('data/' + context.getters.user.uid + '/lastAccess').set(new Date().toString())
      firebase.database.ref('data/' + context.getters.user.uid + '/settings/').on('value', (snapshot) => {
        let payload = snapshot.val()
        context.commit('setUserSettings', payload)
        if (payload && payload.dataUserId && context.getters.user.uid !== payload.dataUserId) {
          context.commit('setDataUserId', payload.dataUserId)
          context.dispatch('loadItems')
        }
      })
      context.dispatch('loadItems')
    },
    loadItems: (context) => {
      let ref = firebase.database.ref('data/' + context.getters.dataUserId + '/items')
      ref.on('value', (snapshot) => {
        context.commit('setItems', snapshot.val())
      })
    },
    transactionLog: (context, payload) => {
      let dateString = Helpers.getDateString()
      let timeString = Helpers.getTimeString()
      payload.uid = context.getters.user.uid
      payload.user = context.getters.user.email
      firebase.database.ref('data/' + context.getters.dataUserId + '/transactions/' + dateString + '/' + timeString + '-' + payload.action).set(payload)
      firebase.database.ref('data/' + context.getters.dataUserId + '/transaction').set(payload)
    },

    addItem: (context, item) => {
      let transaction = {time: new Date().toString(), action: 'addItem', payload: item, key: item.key}
      context.dispatch('transactionLog', transaction)
      if (item.details) {
        item.priority = context.getters.settings.priority.default
        firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key).set(item)
      } else {
        let query = 'https://api.themoviedb.org/3/' + item.media_type + '/' + item.id + '?api_key=' + context.state._settings.movieDbApiKey + '&language=' + context.state._locale
        axios.get(query).then(
          (response) => {
            if (response.status === 200) {
              let details = response.data
              details.media_type = item.media_type
              details.key = item.media_type + ':' + details.id
              details.details = true
              details.priority = context.getters.settings.priority.default
              firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + details.key).set(details)
            }
          })
      }
    },
    updateItem: (context, item) => {
      let transaction = {time: new Date().toString(), action: 'updateItem', payload: item, key: item.key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key).set(item)
    },
    removeItem: (context, key) => {
      let transaction = {time: new Date().toString(), action: 'removeItem', payload: null, key: key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + key).remove()
    },
    setItemPriority: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'setItemPriority', payload: payload.priority, key: payload.key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + payload.key).update({
        'priority': payload.priority
      })
    },
    getComments: (context, key) => {
      firebase.database.ref('comments/' + key).on('value', (snapshot) => {
        context.commit('setComments', snapshot.val())
      })
    },
    addComment: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'addComment', payload: payload.comment, key: payload.key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('comments/' + payload.key).push(payload.comment)
    },
    setItemDownloaded: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'setItemDownloaded', payload: payload.downloaded, key: payload.key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + payload.key).update({
        'downloaded': payload.downloaded
      })
    },
    setSeasonsDownloaded: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'setAllSeasonDownloaded', payload: payload, key: 'tv:' + payload.itemId}
      context.dispatch('transactionLog', transaction)
      let seasons = {}
      let season = null
      let length = 0
      payload.seasons.forEach(s => {
        season = {}
        length = s.episodes ? s.episodes.length : s.episode_count
        for (let i = 1; i <= length; i++) {
          season[i] = {}
          season[i]['downloaded'] = payload.downloaded
        }
        seasons[s.season_number] = season
      })
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/tv:' + payload.itemId + '/downloadedEpisodes').update(seasons)
    },
    setSeasonDownloaded: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'setSeasonDownloaded', payload: payload, key: 'tv:' + payload.itemId}
      context.dispatch('transactionLog', transaction)
      let season = {}
      for (let i = 1; i <= payload.episodeCount; i++) {
        season[i] = {}
        season[i]['downloaded'] = payload.downloaded
      }
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/tv:' + payload.itemId + '/downloadedEpisodes/' + payload.season).update(season)
    },
    setEpisodeDownloaded: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'setEpisodeDownloaded', payload: payload, key: 'tv:' + payload.itemId}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/tv:' + payload.itemId + '/downloadedEpisodes/' + payload.season + '/' + payload.episode).update({
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
          query = 'https://api.themoviedb.org/3/search/' + parameters.media_type + '?api_key=' + context.state._settings.movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._suggestionsPage + 1) + '&query=' + parameters.searchString
          break
        case 'popular':
          query = 'https://api.themoviedb.org/3/' + parameters.media_type + '/popular?api_key=' + context.state._settings.movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._suggestionsPage + 1)
          break
        case 'top_rated':
          query = 'https://api.themoviedb.org/3/' + parameters.media_type + '/top_rated?api_key=' + context.state._settings.movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._suggestionsPage + 1)
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
      query = 'https://api.themoviedb.org/3/' + parameters.media_type + '/' + parameters.id + '?api_key=' + context.state._settings.movieDbApiKey + '&language=' + context.state._locale + '&append_to_response=credits,recommendations'

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
    getSuggestionSeason: (context, parameters) => {
      let query = null
      query = 'https://api.themoviedb.org/3/tv/' + parameters.id + '/season/' + parameters.season_number + '?api_key=' + context.state._settings.movieDbApiKey + '&language=' + context.state._locale

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
    userSettings: (state) => { return state._userSettings },
    dataUserId: (state) => { return state._dataUserId },
    loading: (state) => { return state._loading },

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
    comments: (state) => { return state._comments },

    suggestionDetails: (state) => { return state._suggestionDetails },
    suggestionSeasons: (state) => { return state._suggestionSeasons },
    suggestionSeason: (state) => (number) => { return state._suggestionSeasons !== null ? state._suggestionSeasons['season_' + number] : null },
    suggestions: (state) => { return state._suggestions },
    suggestionsArray: (state) => {
      let array = []
      for (let key in state._suggestions) {
        let item = state._suggestions[key]
        array.push(item)
      }
      return array
    },

    settings: (state) => { return state._settings },
    locale: (state) => { return state._locale },
    movieDbConfiguration: (state) => { return state._movieDbConfiguration }
  }
})
