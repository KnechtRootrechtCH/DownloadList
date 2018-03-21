import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '../firebase'
// import { firebaseMutations } from 'vuexfire'

Vue.use(Vuex)

// var moviesRef = db.ref('movies')
// var showsRef = db.ref('shows')
// console.log('ref', moviesRef)
// console.log('ref', showsRef)

export const store = new Vuex.Store({
  state: {
    _movieDbApiKey: '',
    _fallbackMovieBackdrop: '',
    _fallbackTvBackdrop: '',
    _locale: 'en',
    _user: null,

    _movies: [],
    _shows: []
  },
  mutations: {
    setMovieDbApiKey: (state, payload) => { state._movieDbApiKey = payload },
    setFallbackMovieBackdrop: (state, payload) => { state._fallbackMovieBackdrop = payload },
    setFallbackTvBackdrop: (state, payload) => { state._fallbackTvBackdrop = payload },

    setLocale: state => { state._locale = navigator.language.trim().substring(0, 2) },
    setUser: state => { state._user = firebase.authentication.currentUser },

    setMovies (state, movies) { state._movies = movies },
    removeMovie (state, id) {
      state._movies = state._movies.filter(i => i.id !== id)
    },
    addMovie (state, item) {
      state._movies = state._movies.filter(i => i.id !== item.id)
      state._movies.push(item)
    },
    setMoviePriority (state, payload) {
      var id = payload.id
      var priority = payload.priority
      var item = state._movies.find(i => i.id === id)
      item.priority = priority
    }
  },
  actions: {
    getFirebaseData: (context) => {
      firebase.database.ref('settings/movieDbApiKey').on('value', (snapshot) => {
        context.commit('setMovieDbApiKey', snapshot.val())
      })
      firebase.database.ref('settings/fallbackMovieBackdrop').on('value', (snapshot) => {
        console.log(snapshot.val())
        context.commit('setFallbackMovieBackdrop', snapshot.val())
      })
    },

    getInitiatlState: context => {
      console.log('test')
    },
    loadMovies: context => { context.commit('setMovies') }
  },
  getters: {
    test: (state) => { return state._test },
    firebase: (state) => { return state._firebase },
    user: (state) => { return state._user },
    movie: (state) => (id) => { return state._movies.find(i => i.id === id) },
    movies: (state) => { return state._movies },
    shows: (state) => { return state._shows },
    locale: (state) => { return state._locale },
    movieDbApiKey: (state) => { return state._movieDbApiKey },
    fallbackMovieBackdrop: (state) => { return state._fallbackMovieBackdrop },
    fallbackTvBackdrop: (state) => { return state._fallbackTvBackdrop }
  }
})
