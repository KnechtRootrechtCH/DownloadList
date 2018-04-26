import Constants from '../constants'
import Helpers from '../helpers'

export default {
  computed: {
    constants () {
      return Constants
    },
    helpers () {
      return Helpers
    },
    priorities () {
      let priorities = []
      for (let i = Constants.PRIORITY.MIN; i >= Constants.PRIORITY.MAX; i--) {
        priorities.push(i)
      }
      return priorities
    },
    settings () {
      return this.$store.getters.settings
    }
  },
  methods: {
    openUrl (url, target) {
      let win = window.open(url, '_blank')
      win.focus()
    },
    routeTo (target) {
      this.$router.push({
        path: target
      })
    },
    destroyTooltips () {
      // quite a hack, but works
      let tooltips = document.getElementsByClassName('tooltip')
      for (let i = tooltips.length - 1; i >= 0; i--) {
        // Remove first element (at [0]) repeatedly
        tooltips[0].parentNode.removeChild(tooltips[0])
      }
    }
  }
}
