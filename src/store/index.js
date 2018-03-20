import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    movieDbApiKey: '23703a8a857927f41414fb155404393d',
    locale: 'en',
    movies: [],
    shows: []
  },
  mutations: {
    setUser: state => { state.user = firebase.auth().currentUser },
    setMovies (state, movies) { state.movies = movies },
    removeMovie (state, id) {
      state.movies = state.movies.filter(i => i.id !== id)
    },
    addMovie (state, item) {
      state.movies = state.movies.filter(i => i.id !== item.id)
      state.movies.push(item)
    },
    setMoviePriority (state, payload) {
      var id = payload.id
      var priority = payload.priority
      var item = state.movies.find(i => i.id === id)
      item.priority = priority
    }
  },
  actions: {
    loadMovies: context => { context.commit('setMovies') } // TODO: load from firebase
  },
  getters: {
    getUser: (state) => { return state.user },
    getMovie: (state) => (id) => { return state.movies.find(i => i.id === id) },
    getMovies: (state) => { return state.movies },
    getShows: (state) => { return state.shows },
    getMvieDbApiKey: (state) => { return state.movieDbApiKey }
  }
})
