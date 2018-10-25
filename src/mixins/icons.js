import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

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
import undoIcon from '@fortawesome/fontawesome-free-solid/faUndoAlt'
import checkIcon from '@fortawesome/fontawesome-free-solid/faCheckCircle'
import editIcon from '@fortawesome/fontawesome-free-solid/faEdit'
import cogIcon from '@fortawesome/fontawesome-free-solid/faCog'
import searchIcon from '@fortawesome/fontawesome-free-solid/faSearch'
import timesIcon from '@fortawesome/fontawesome-free-solid/faTimes'
import filterIcon from '@fortawesome/fontawesome-free-solid/faFilter'
import sortIcon from '@fortawesome/fontawesome-free-solid/faSort'
import exclamationIcon from '@fortawesome/fontawesome-free-solid/faExclamation'
import exclamationCircleIcon from '@fortawesome/fontawesome-free-solid/faExclamationCircle'
import exclamationTriangleIcon from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'
import playIcon from '@fortawesome/fontawesome-free-solid/faPlayCircle'
import commentIcon from '@fortawesome/fontawesome-free-solid/faComment'
import chevronUpIcon from '@fortawesome/fontawesome-free-solid/faChevronCircleUp'
import chevronDownIcon from '@fortawesome/fontawesome-free-solid/faChevronCircleDown'
import clockIcon from '@fortawesome/fontawesome-free-solid/faClock'
import pencilIcon from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import trashIcon from '@fortawesome/fontawesome-free-solid/faTrash'
import banIcon from '@fortawesome/fontawesome-free-solid/faBan'
import hourglassIcon from '@fortawesome/fontawesome-free-solid/faHourglass'
import spinnerIcon from '@fortawesome/fontawesome-free-solid/faSpinner'
import downloadIcon from '@fortawesome/fontawesome-free-solid/faDownload'
import tasksIcon from '@fortawesome/fontawesome-free-solid/faTasks'
import bellIcon from '@fortawesome/fontawesome-free-solid/faBell'
import flagIcon from '@fortawesome/fontawesome-free-solid/faFlag'
import calendarIcon from '@fortawesome/fontawesome-free-solid/faCalendarAlt'
import gridIcon from '@fortawesome/fontawesome-free-solid/faThLarge'
import listIcon from '@fortawesome/fontawesome-free-solid/faListAlt'
import listExtendedIcon from '@fortawesome/fontawesome-free-solid/faThList'
import fileIcon from '@fortawesome/fontawesome-free-solid/faFile'
import wordIcon from '@fortawesome/fontawesome-free-solid/faFileWord'
import excelIcon from '@fortawesome/fontawesome-free-solid/faFileExcel'

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
        case 'undo': return undoIcon
        case 'edit': return editIcon
        case 'cog': return cogIcon
        case 'search': return searchIcon
        case 'times': return timesIcon
        case 'filter': return filterIcon
        case 'filterAlt': return filterIcon
        case 'sort': return sortIcon
        case 'exclamation': return exclamationIcon
        case 'exclamationCircle': return exclamationCircleIcon
        case 'exclamationTriangle': return exclamationTriangleIcon
        case 'play': return playIcon
        case 'comment': return commentIcon
        case 'chevron-up': return chevronUpIcon
        case 'chevron-down': return chevronDownIcon
        case 'clock': return clockIcon
        case 'pencil': return pencilIcon
        case 'trash': return trashIcon
        case 'ban': return banIcon
        case 'hourglass': return hourglassIcon
        case 'spinner' : return spinnerIcon
        case 'download' : return downloadIcon
        case 'tasks' : return tasksIcon
        case 'bell' : return bellIcon
        case 'flag' : return flagIcon
        case 'calendar' : return calendarIcon
        case 'grid' : return gridIcon
        case 'list' : return listIcon
        case 'listExtended' : return listExtendedIcon
        case 'file' : return fileIcon
        case 'word' : return wordIcon
        case 'excel' : return excelIcon
        default: return defaultIcon
      }
    }
  },
  components: {
    FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText
  }
}
