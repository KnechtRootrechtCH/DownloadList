import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

import defaultIcon from '@fortawesome/fontawesome-free-solid/faCircle'

import infoIcon from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import linkIcon from '@fortawesome/fontawesome-free-solid/faLink'
import globeIcon from '@fortawesome/fontawesome-free-solid/faGlobe'
import movieIcon from '@fortawesome/fontawesome-free-solid/faFilm'
import tvIcon from '@fortawesome/fontawesome-free-solid/faTv'
import plusIcon from '@fortawesome/fontawesome-free-solid/faPlusCircle'
import minusIcon from '@fortawesome/fontawesome-free-solid/faMinusCircle'
import starIcon from '@fortawesome/fontawesome-free-solid/faStar'
import redoIcon from '@fortawesome/fontawesome-free-solid/faRedoAlt'
import checkIcon from '@fortawesome/fontawesome-free-solid/faCheckCircle'
import editIcon from '@fortawesome/fontawesome-free-solid/faEdit'
import cogIcon from '@fortawesome/fontawesome-free-solid/faCog'
import searchIcon from '@fortawesome/fontawesome-free-solid/faSearch'
import timesIcon from '@fortawesome/fontawesome-free-solid/faTimes'
import filterIcon from '@fortawesome/fontawesome-free-solid/faFilter'
import sortIcon from '@fortawesome/fontawesome-free-solid/faSort'
import exclamationIcon from '@fortawesome/fontawesome-free-solid/faExclamationCircle'
import playIcon from '@fortawesome/fontawesome-free-solid/faPlayCircle'
import commentIcon from '@fortawesome/fontawesome-free-solid/faComment'
import chevronUpIcon from '@fortawesome/fontawesome-free-solid/faChevronCircleUp'
import chevronDownIcon from '@fortawesome/fontawesome-free-solid/faChevronCircleDown'
import clockIcon from '@fortawesome/fontawesome-free-solid/faClock'
import pencilIcon from '@fortawesome/fontawesome-free-solid/faPencilAlt'

export default {
  methods: {
    icon (icon) {
      switch (icon) {
        case 'info': return infoIcon
        case 'link': return linkIcon
        case 'globe': return globeIcon
        case 'movie': return movieIcon
        case 'tv': return tvIcon
        case 'plus': return plusIcon
        case 'minus': return minusIcon
        case 'star': return starIcon
        case 'check': return checkIcon
        case 'redo': return redoIcon
        case 'edit': return editIcon
        case 'cog': return cogIcon
        case 'search': return searchIcon
        case 'times': return timesIcon
        case 'filter': return filterIcon
        case 'sort': return sortIcon
        case 'exclamation': return exclamationIcon
        case 'play': return playIcon
        case 'comment': return commentIcon
        case 'chevron-up': return chevronUpIcon
        case 'chevron-down': return chevronDownIcon
        case 'clock': return clockIcon
        case 'pencil': return pencilIcon
        default: return defaultIcon
      }
    }
  },
  components: {
    FontAwesomeIcon
  }
}
