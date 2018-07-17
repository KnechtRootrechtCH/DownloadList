// TODO: use moments instead
export default Object.freeze({
  padNumber: function (number, length) {
    let s = number + ''
    while (s.length < length) {
      s = '0' + s
    }
    return s
  },
  getDateString: function (separator) {
    let date = new Date()
    if (!separator) {
      separator = '-'
    }
    let dateString = date.getFullYear() + separator + this.padNumber(date.getMonth() + 1, 2) + separator + this.padNumber(date.getDate(), 2)
    return dateString
  },
  getTimeString: function (separator) {
    let date = new Date()
    if (!separator) {
      separator = '-'
    }
    let timeString = this.padNumber(date.getHours(), 2) + separator + this.padNumber(date.getMinutes(), 2) + separator + this.padNumber(date.getSeconds(), 2)
    return timeString
  }
})
