// TODO: use moments instead
export default Object.freeze({
  padNumber: function (number, length) {
    let s = number + ''
    while (s.length < length) {
      s = '0' + s
    }
    return s
  },
  getDateString: function () {
    let date = new Date()
    let dateString = date.getFullYear() + '-' + this.padNumber(date.getMonth() + 1, 2) + '-' + this.padNumber(date.getDate(), 2)
    return dateString
  },
  getTimeString: function () {
    let date = new Date()
    let timeString = this.padNumber(date.getHours(), 2) + '-' + this.padNumber(date.getMinutes(), 2) + '-' + this.padNumber(date.getSeconds(), 2)
    return timeString
  }
})
