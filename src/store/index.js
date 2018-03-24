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

    _movies: {},
    _movieSuggestions: [],
    _movieSuggestionsPage: 0,
    _movieSuggestionsPages: 0,
    _movieSuggestionsCount: 0,

    _tv: {},
    _tvSuggestions: [],
    _tvSuggestionsPage: 0,
    _tvSuggestionsPages: 0,
    _tvSuggestionsCount: 0
  },
  mutations: {
    setMovieDbApiKey: (state, payload) => { state._movieDbApiKey = payload },
    setFallbackMovieBackdrop: (state, payload) => { state._fallbackMovieBackdrop = payload },
    setFallbackTvBackdrop: (state, payload) => { state._fallbackTvBackdrop = payload },

    setLocale: state => { state._locale = navigator.language.trim().substring(0, 2) },
    setUser: state => {
      state._user = firebase.authentication.currentUser
    },

    setMovies (state, movies) { state._movies = movies },
    resetMovieSuggestions (state) {
      state._movieSuggestionsCount = 0
      state._movieSuggestionsPage = 0
      state._movieSuggestionsPages = 0
      state._movieSuggestions = []
    },
    setMovieSuggestions (state, payload) {
      state._movieSuggestionsCount = payload.count
      state._movieSuggestionsPage = payload.page
      state._movieSuggestionsPages = payload.pages
      if (payload.page <= 1) {
        state._movieSuggestions = []
      }
      payload.items.forEach(element => {
        state._movieSuggestions.push(element)
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
      firebase.database.ref('data/' + uid + '/movies/').on('value', (snapshot) => {
        context.commit('setMovies', snapshot.val())
      })
      firebase.database.ref('data/' + uid + '/tv/').on('value', (snapshot) => {
        context.commit('setTv', snapshot.val())
      })
    },
    addMovie: (context, item) => {
      let uid = context.getters.user.uid
      item.type = 'movie'
      firebase.database.ref('data/' + uid + '/movies/' + item.id).set(item)
    },
    removeMovie: (context, id) => {
      let uid = context.getters.user.uid
      firebase.database.ref('data/' + uid + '/movies/' + id).set(null)
    },
    setMoviePriority: (context, payload) => {
      let uid = context.getters.user.uid
      firebase.database.ref('data/' + uid + '/movies/' + payload.id).update({
        'priority': payload.priority
      })
    },
    getMovieSuggestions: (context, parameters) => {
      if (context.state._movieSuggestionsPage !== 0 && context.state._movieSuggestionsPage === context.state._movieSuggestionsPages) {
        return
      }

      let query = null
      switch (parameters.queryType) {
        case 'search':
          query = 'https://api.themoviedb.org/3/search/movie?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._movieSuggestionsPage + 1) + '&query=' + parameters.searchString
          break
        case 'popular':
          query = 'https://api.themoviedb.org/3/movie/popular?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._movieSuggestionsPage + 1)
          break
      }

      axios.get(query).then(
        (response) => {
          context.commit('setMovieSuggestions', {
            'count': response.data.total_results,
            'pages': response.data.total_pages,
            'page': response.data.page,
            'items': response.data.results
          })
        })
    },

    addTv: (context, item) => {
      let uid = context.getters.user.uid
      item.type = 'tv'
      firebase.database.ref('data/' + uid + '/tv/' + item.id).set(item)
    },
    removeTv: (context, id) => {
      let uid = context.getters.user.uid
      firebase.database.ref('data/' + uid + '/tv/' + id).set(null)
    },
    setTvPriority: (context, payload) => {
      let uid = context.getters.user.uid
      firebase.database.ref('data/' + uid + '/tv/' + payload.id).update({
        'priority': payload.priority
      })
    },
    getTvSuggestions: (context, parameters) => {
      if (context.state._tvSuggestionsPage !== 0 && context.state._tvSuggestionsPage === context.state._tvSuggestionsPages) {
        return
      }

      let query = null
      switch (parameters.queryType) {
        case 'search':
          query = 'https://api.themoviedb.org/3/search/tv?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._tvSuggestionsPage + 1) + '&query=' + parameters.searchString
          break
        case 'popular':
          query = 'https://api.themoviedb.org/3/tv/popular?api_key=' + context.state._movieDbApiKey + '&language=' + context.state._locale + '&page=' + (context.state._tvSuggestionsPage + 1)
          break
      }

      axios.get(query).then(
        (response) => {
          context.commit('setTvSuggestions', {
            'count': response.data.total_results,
            'pages': response.data.total_pages,
            'page': response.data.page,
            'items': response.data.results
          })
        })
    }
  },
  getters: {
    test: (state) => { return state._test },
    firebase: (state) => { return state._firebase },
    user: (state) => { return state._user },
    movies: (state) => { return state._movies },
    movie: (state) => (id) => { return state._movies !== null ? state._movies[id] : null },
    movieSuggestions: (state) => { return state._movieSuggestions },
    tvs: (state) => { return state._tv },
    tv: (state) => (id) => { return state._tv !== null ? state._tv[id] : null },
    tvSuggestions: (state) => { return state._tvSuggestions },
    locale: (state) => { return state._locale },
    movieDbApiKey: (state) => { return state._movieDbApiKey },
    fallbackMovieBackdrop: (state) => { return state._fallbackMovieBackdrop },
    fallbackTvBackdrop: (state) => { return state._fallbackTvBackdrop }
  }
})
