import Vue from 'vue'
import firebase from 'firebase'

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

export default {
  database: firebase.database(),
  authentication: firebase.auth()
}
