export default Object.freeze({
  MEDIA_TYPE: {
    TV: 'tv',
    MOVIE: 'movie',
    PERSON: 'person'
  },
  JOB: {
    DIRECTOR: 'director'
  },
  CAST_DISPLAY_COUNT: 5,
  COLOR: {
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    DARKRED: 'darkred',
    LIMEGREEN: 'limegreen',
    ORANGE: 'orange',
    PURPLE: 'purple',
    DARKGREY: 'darkgrey',
    GREY: 'grey',
    NETFLIX_RED: 'netflix-red',
    GOLD: 'gold'
  },
  IMAGESIZE: {
    BACKDROP: {
      W300: { key: 'w300', width: 300, height: 170 },
      W500: { key: 'w500', width: 500, height: 281 },
      W780: { key: 'w780', width: 780, height: 440 },
      W1280: { key: 'w1280', width: 1280, height: 723 },
      W1400: { key: 'w1400_and_h450_face', width: 1400, height: 450 }
    },
    POSTER: {
      W92: { key: 'w92', width: 92, height: 130 },
      W154: { key: 'w154', width: 154, height: 218 },
      W185: { key: 'w185', width: 185, height: 262 },
      W342: { key: 'w342', width: 342, height: 482 },
      W500: { key: 'w500', width: 500, height: 705 },
      W780: { key: 'w780', width: 780, height: 1100 }
    },
    PROFILE: {
      W45: { key: 'w45', width: 45, height: 68 },
      W185: { key: 'w185', width: 185, height: 278 },
      H632: { key: 'h632', width: 421, height: 632 }
    },
    STILL: {
      W185: { key: 'w185', width: 185, height: 104 }
    }
  },
  LIST_FILTER_DEFAULT: {
    movie: true,
    tv: true,
    downloaded: false,
    queued: true,
    notYetAvailable: true,
    todo: true,
    hardToFind: true,
    priority1: true,
    priority2: true,
    priority3: true,
    priority4: true,
    priority5: true,
    text: ''
  }
})
