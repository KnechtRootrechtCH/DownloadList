import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
// import { firebaseMutations } from 'vuexfire'

Vue.use(Vuex)
Vue.use(firebase)

let firebaseConfig = {
  apiKey: 'AIzaSyAiT0HW9uJ-enr4DvXMIiF8MY0RftBsDUg',
  authDoman: 'downloadlist-7465c.firebaseapp.com',
  databaseURL: 'https://downloadlist-7465c.firebaseio.com/',
  projectId: 'dwnloadlist-7465c',
  storageBuckt: 'downloadlist-765c.appspot.com',
  messagingSenderd: '364654976505'
}

firebase.initializeApp(firebaseConfig)
var db = firebase.database()
var moviesRef = db.ref('movies')
var showsRef = db.ref('shows')
console.log('ref', moviesRef)
console.log('ref', showsRef)

export const store = new Vuex.Store({
  state: {
    _firebase: firebase,
    _firebaseConfig: firebaseConfig,
    _user: null,
    _movieDbApiKey: '23703a8a857927f41414fb155404393d',
    _locale: 'en',
    _movies: [],
    _shows: []
  },
  mutations: {
    setLocale: state => { state._locale = navigator.language.trim().substring(0, 2) },
    setUser: state => { state._user = firebase.auth().currentUser },
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
    getInitiatlState: context => {
      // TODO: load from firebase
    },
    loadMovies: context => { context.commit('setMovies') }
  },
  getters: {
    getFirebase: (state) => { return state._firebase },
    getUser: (state) => { return state._user },
    getMovie: (state) => (id) => { return state._movies.find(i => i.id === id) },
    getMovies: (state) => { return state._movies },
    getShows: (state) => { return state._shows },
    getLocale: (state) => { return state._locale },
    getMovieDbApiKey: (state) => { return state._movieDbApiKey }
  }
})
