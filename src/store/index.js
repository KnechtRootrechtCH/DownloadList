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
    _userInfo: null,
    _userSettings: null,
    _dataUserId: null,
    _loading: false,

    _items: {},
    _itemsInitialized: false,
    _comments: [],
    _suggestionDetails: null,
    _suggestionSeasons: {},
    _suggestions: {},
    _suggestionsPage: 0,
    _suggestionsPages: 0,
    _suggestionsCount: 0,

    _messages: []
  },
  mutations: {
    setSettings: (state, payload) => { state._settings = payload },
    setMovieDbConfiguration: (state, payload) => { state._movieDbConfiguration = payload },

    setLocale: state => { state._locale = navigator.language.trim().substring(0, 2) },
    setUser: state => {
      if (firebase.authentication && firebase.authentication.currentUser) {
        state._user = firebase.authentication.currentUser
        state._dataUserId = firebase.authentication.currentUser.uid
        let userInfo = {}
        userInfo.userAgent = window.navigator.userAgent
        let userAgent = userInfo.userAgent.toLowerCase()
        userInfo.isAndoid = userAgent.indexOf('android') >= 0
        userInfo.isChrome = userAgent.indexOf('chrome') >= 0
        userInfo.isIE = userAgent.indexOf('msie ') >= 0 || userAgent.indexOf('trident') >= 0
        state._userInfo = userInfo
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
    setItemsInitialized: (state, initialized) => { state._itemsInitialized = initialized },
    removeItem: (state, item) => {
      Vue.set(state._items, item.key, null)
    },
    updateItem: (state, item) => {
      Vue.set(state._items, item.key, item)
    },
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
    },
    setMessages: (state, messages) => { state._messages = messages }
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
      context.commit('setLoading', true)
      let dateString = Helpers.getDateString('/')
      let timeString = Helpers.getTimeString()
      firebase.database.ref('data/' + context.getters.user.uid + '/access/' + dateString + '/' + timeString).set(new Date().toString())
      firebase.database.ref('data/' + context.getters.user.uid + '/lastAccess').set(new Date().toString())
      firebase.database.ref('data/' + context.getters.user.uid + '/settings/').on('value', (snapshot) => {
        let payload = snapshot.val()
        context.commit('setUserSettings', payload)
        if (payload && payload.dataUserId && context.getters.user.uid !== payload.dataUserId) {
          context.commit('setDataUserId', payload.dataUserId)
        }
        context.dispatch('loadItems')
        context.dispatch('loadMessages')
      })
    },

    transactionLog: (context, payload) => {
      let dateString = Helpers.getDateString('/')
      let timeString = Helpers.getTimeString()
      payload.uid = context.getters.user.uid
      payload.user = context.getters.user.email
      payload.userInfo = context.getters.userInfo
      let uid = context.getters.dataUserId
      if (payload.action.indexOf('Comment') !== -1) {
        uid = context.getters.user.uid
      }
      if (payload.action.indexOf('Message') !== -1) {
        uid = context.getters.user.uid
      }
      firebase.database.ref('data/' + uid + '/transactions/' + dateString + '/' + timeString + '-' + payload.action).set(payload)
      firebase.database.ref('data/' + uid + '/transaction').set(payload)
    },

    loadItems: (context) => {
      let ref = firebase.database.ref('data/' + context.getters.dataUserId + '/items')

      ref.on('child_added', (snapshot) => {
        if (context.getters.itemsInitialized) {
          context.commit('updateItem', snapshot.val())
          context.dispatch('addItemCredits', {
            id: snapshot.val().id,
            key: snapshot.val().key,
            mediaType: snapshot.val().media_type
          })
          context.commit('updateItem', snapshot.val())
          context.dispatch('sanitizeItem', {
            key: snapshot.val().key
          })
        }
      })
      ref.on('child_changed', (snapshot) => {
        context.commit('updateItem', snapshot.val())
      })
      ref.on('child_removed', (snapshot) => {
        context.commit('removeItem', snapshot.val())
      })

      ref.once('value', (snapshot) => {
        context.commit('setLoading', false)
        context.commit('setItems', snapshot.val())
        context.commit('setItemsInitialized', true)

        if (context.getters.settings.addCreditInfoToItems) {
          let items = context.getters.items
          let keys = Object.keys(items)
          let max = context.getters.settings.addCreditInfoToItems
          if (max > keys.length) {
            max = keys.length - 1
          }

          let count = 0
          for (let i = 0; i < keys.length; i++) {
            let item = items[keys[i]]
            if (count > max) {
              break
            }
            if (!item.director || !item.cast) {
              count++
              context.dispatch('addItemCredits', {
                id: item.id,
                key: item.key,
                mediaType: item.media_type
              })
            }
          }
        }
      })
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

    loadMessages: (context) => {
      let ref = firebase.database.ref('messages')
      ref.on('value', (snapshot) => {
        context.commit('setMessages', snapshot.val())
      })
    },
    addMessage: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'addMessage', payload: payload, key: null}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('messages/').push(payload)
    },
    removeMessage: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'removeMessage', payload: payload.messageId, key: null}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('messages/' + payload.messageId).remove()
    },

    getComments: (context, itemKey) => {
      let ref = firebase.database.ref('comments/' + itemKey)
      ref.on('value', (snapshot) => {
        context.commit('setComments', snapshot.val())
      })
    },
    addComment: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'addComment', payload: payload.comment, key: payload.itemKey}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('comments/' + payload.itemKey).push(payload.comment)
    },
    removeComment: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'removeComment', payload: payload.commentId, key: payload.itemKey}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('comments/' + payload.itemKey + '/' + payload.commentId).remove()
    },
    setItemDownloaded: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'setItemDownloaded', payload: payload.downloaded, key: payload.key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + payload.key).update({
        'downloaded': payload.downloaded
      })
    },
    setItemDownloadStatus: (context, payload) => {
      let transaction = {time: new Date().toString(), action: 'setItemDownloadStatus', payload: payload.status, key: payload.key}
      context.dispatch('transactionLog', transaction)
      firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + payload.key).update({
        'downloadStatus': payload.status
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
      query = 'https://api.themoviedb.org/3/' + parameters.media_type + '/' + parameters.id + '?api_key=' + context.state._settings.movieDbApiKey + '&language=' + context.state._locale + '&append_to_response=credits,recommendations,release_dates'

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
    },
    addItemCredits: (context, parameters) => {
      let query = 'https://api.themoviedb.org/3/' + parameters.mediaType + '/' + parameters.id + '/credits?api_key=' + context.state._settings.movieDbApiKey
      axios.get(query).then(
        (response) => {
          if (response.status === 200) {
            let directorString = ''
            let castString = ''

            let crew = response.data.crew
            let cast = response.data.cast

            if (crew) {
              let director = null
              crew.forEach(c => {
                if (c.job.toLowerCase() === Constants.JOB.DIRECTOR) {
                  director = c
                }
              })
              if (director) {
                directorString = director.name
              }
            }

            if (cast) {
              if (cast.length > Constants.CAST_DISPLAY_COUNT) {
                cast = cast.slice(0, Constants.CAST_DISPLAY_COUNT)
              }
              let names = cast.map(x => x.name)
              castString = names.join(', ')
            }

            let item = context.state._items[parameters.key]
            if (item) {
              // console.log(`credits loaded for ${item.key}: title=${item.title}, director=${directorString}, cast=${castString}`)
              firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key + '/director').set(directorString)
              firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key + '/cast').set(castString)
            }
          }
        })
    },
    sanitizeItems: (context) => {
      for (let key in context.getters.items) {
        context.dispatch('sanitizeItem', {
          key: key
        })
      }
    },
    sanitizeItem: (context, parameters) => {
      let item = context.getters.items[parameters.key]
      if (!item) {
        return
      }
      if (item.production_companies) {
        firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key + '/production_companies').remove()
      }
      if (item.production_countries) {
        firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key + '/production_countries').remove()
      }
      if (item.spoken_languages) {
        firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key + '/spoken_languages').remove()
      }
      if (item.networks) {
        firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key + '/networks').remove()
      }
      if (item.languages) {
        firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key + '/languages').remove()
      }
      if (item.origin_country) {
        firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key + '/origin_country').remove()
      }
      if (item.origin_country) {
        firebase.database.ref('data/' + context.getters.dataUserId + '/items/' + item.key + '/origin_country').remove()
      }
    }
  },
  getters: {
    test: (state) => { return state._test },
    firebase: (state) => { return state._firebase },
    user: (state) => { return state._user },
    userInfo: (state) => { return state._userInfo },
    userSettings: (state) => { return state._userSettings },
    dataUserId: (state) => { return state._dataUserId },
    loading: (state) => { return state._loading },

    items: (state) => { return state._items },
    itemsInitialized: (state) => { return state._itemsInitialized },
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
    movieDbConfiguration: (state) => { return state._movieDbConfiguration },

    messages: (state) => { return state._messages },
    messagesArray: (state) => {
      let array = []
      for (let key in state._messages) {
        let message = state._messages[key]
        message.key = key
        array.push(message)
      }
      return array
    }
  }
})
