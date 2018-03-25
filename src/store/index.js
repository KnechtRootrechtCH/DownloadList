import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '../firebase'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

export const store = new Vuex.Store({
  state: {
    _movieDbApiKey: '23703a8a857927f41414fb155404393d',
    _fallbackMovieBackdrop: '',
    _fallbackTvBackdrop: '',
    _locale: 'en',
    _user: null,

    _items: {},
    _suggestions: [],
    _suggestionsPage: 0,
    _suggestionsPages: 0,
    _suggestionsCount: 0
  },
  mutations: {
    setMovieDbApiKey: (state, payload) => { state._movieDbApiKey = payload },
    setFallbackMovieBackdrop: (state, payload) => { state._fallbackMovieBackdrop = payload },
    setFallbackTvBackdrop: (state, payload) => { state._fallbackTvBackdrop = payload },

    setLocale: state => { state._locale = navigator.language.trim().substring(0, 2) },
    setUser: state => {
      state._user = firebase.authentication.currentUser
    },

    setItems (state, items) { state._items = items },
    resetSuggestions (state) {
      state._suggestionsCount = 0
      state._suggestionsPage = 0
      state._suggestionsPages = 0
      state._suggestions = []
    },
    setSuggestions (state, payload) {
      state._suggestionsCount = payload.count
      state._suggestionsPage = payload.page
      state._suggestionsPages = payload.pages
      if (payload.page <= 1) {
        state._suggestions = []
      }
      payload.items.forEach(item => {
        item.mediaType = payload.mediaType
        item.key = payload.mediaType + ':' + item.id
        state._suggestions.push(item)
      })
    },

    setTv (state, tv) { state._tv = tv },
    resetTvSuggestions (state) {
      state._tvSuggestionsCount = 0
      state._tvSuggestionsPage = 0
      state._tvSuggestionsPages = 0
      state._tvSuggestions = []
    },
    setTvSuggestions (state, payload) {
      state._tvSuggestionsCount = payload.count
      state._tvSuggestionsPage = payload.page
      state._tvSuggestionsPages = payload.pages
      if (payload.page <= 1) {
        state._tvSuggestions = []
      }
      payload.items.forEach(element => {
        state._tvSuggestions.push(element)
      })
    }
  },
  actions: {
    getFirebaseData: (context) => {
      firebase.database.ref('settings/movieDbApiKey').on('value', (snapshot) => {
        context.commit('setMovieDbApiKey', snapshot.val())
      })
      firebase.database.ref('settings/fallbackMovieBackdrop').on('value', (snapshot) => {
        context.commit('setFallbackMovieBackdrop', snapshot.val())
      })
      firebase.database.ref('settings/fallbackTvBackdrop').on('value', (snapshot) => {
        context.commit('setFallbackTvBackdrop', snapshot.val())
      })
    },
    getFirebaseUserData: (context) => {
      let uid = context.getters.user.uid
      firebase.database.ref('data/' + uid + '/mail').set(context.getters.user.email)
      firebase.database.ref('data/' + uid + '/items/').on('value', (snapshot) => {
        context.commit('setItems', snapshot.val())
      })
    },

    addItem: (context, item) => {
      let uid = context.getters.user.uid
      firebase.database.ref('data/' + uid + '/items/' + item.key).set(item)
    },
    removeItem: (context, key) => {
      let uid = context.getters.user.uid
      firebase.database.ref('data/' + uid + '/items/' + key).set(null)
    },
    setItemPriority: (context, payload) => {
      let uid = context.getters.user.uid
      firebase.database.ref('data/' + uid + '/items/' + payload.key).update({
        'priority': payload.priority
      })
    },

    getSuggestions: (context, parameters) => {
      if (context.state._suggestionsPage !== 0 && context.state._suggestionsPage === context.state._suggestionsPages) {
        return
      }

      let query = null
      switch (parameters.queryType) {
        case 'search':
          query = 'https://api.themoviedb.org/3/search/' + parameters.mediaType + '?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._suggestionsPage + 1) + '&query=' + parameters.searchString
          break
        case 'popular':
          query = 'https://api.themoviedb.org/3/' + parameters.mediaType + '/popular?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._suggestionsPage + 1)
          break
        case 'top_rated':
          query = 'https://api.themoviedb.org/3/' + parameters.mediaType + '/top_rated?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._suggestionsPage + 1)
          break
      }

      axios.get(query).then(
        (response) => {
          context.commit('setSuggestions', {
            'count': response.data.total_results,
            'pages': response.data.total_pages,
            'page': response.data.page,
            'items': response.data.results,
            'mediaType': parameters.mediaType
          })
        })
    }
  },
  getters: {
    test: (state) => { return state._test },
    firebase: (state) => { return state._firebase },
    user: (state) => { return state._user },

    items: (state) => { return state._items },
    item: (state) => (key) => { return state._items !== null ? state._items[key] : null },
    suggestions: (state) => { return state._suggestions },

    locale: (state) => { return state._locale },
    movieDbApiKey: (state) => { return state._movieDbApiKey },
    fallbackMovieBackdrop: (state) => { return state._fallbackMovieBackdrop },
    fallbackTvBackdrop: (state) => { return state._fallbackTvBackdrop }
  }
})
