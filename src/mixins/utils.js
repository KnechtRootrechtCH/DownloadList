import Constants from '../constants'

export default {
  computed: {
    constants () {
      return Constants
    }
  },
  methods: {
    openUrl (url, target) {
      let win = window.open(url, '_blank')
      win.focus()
    }
  }
}
