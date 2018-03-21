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
    _movieDbApiKey: '23703a8a857927f41414fb155404393d',
    _fallbackMovieBackdrop: '',
    _fallbackTvBackdrop: '',
    _locale: 'en',
    _user: null,

    _movies: {},
    _shows: {}
  },
  mutations: {
    setMovieDbApiKey: (state, payload) => { state._movieDbApiKey = payload },
    setFallbackMovieBackdrop: (state, payload) => { state._fallbackMovieBackdrop = payload },
    setFallbackTvBackdrop: (state, payload) => { state._fallbackTvBackdrop = payload },

    setLocale: state => { state._locale = navigator.language.trim().substring(0, 2) },
    setUser: state => {
      state._user = firebase.authentication.currentUser
    },
    setMovies (state, movies) { state._movies = movies }
  },
  actions: {
    addMovie: (context, item) => {
      let uid = context.getters.user.uid
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
    getFirebaseData: (context) => {
      let uid = context.getters.user.uid
      firebase.database.ref('settings/movieDbApiKey').on('value', (snapshot) => {
        context.commit('setMovieDbApiKey', snapshot.val())
      })
      firebase.database.ref('settings/fallbackMovieBackdrop').on('value', (snapshot) => {
        context.commit('setFallbackMovieBackdrop', snapshot.val())
      })
      firebase.database.ref('data/' + uid + '/movies/').on('value', (snapshot) => {
        context.commit('setMovies', snapshot.val())
      })
      firebase.database.ref('data/' + uid + '/mail').set(context.getters.user.email)
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
    movies: (state) => { return state._movies },
    movie: (state) => (id) => { return state._movies !== null ? state._movies[id] : null },
    shows: (state) => { return state._shows },
    locale: (state) => { return state._locale },
    movieDbApiKey: (state) => { return state._movieDbApiKey },
    fallbackMovieBackdrop: (state) => { return state._fallbackMovieBackdrop },
    fallbackTvBackdrop: (state) => { return state._fallbackTvBackdrop }
  }
})
