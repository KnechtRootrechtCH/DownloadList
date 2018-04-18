// TODO: use moments instead
export default Object.freeze({
  padNumber: function (number) {
    let s = number + ''
    while (s.length < 2) {
      s = '0' + s
    }
    return s
  },
  getDateString: function () {
    let date = new Date()
    let dateString = date.getFullYear() + '-' + this.padNumber(date.getMonth() + 1) + '-' + this.padNumber(date.getDate())
    return dateString
  },
  getTimeString: function () {
    let date = new Date()
    let timeString = this.padNumber(date.getHours()) + '-' + this.padNumber(date.getMinutes()) + '-' + this.padNumber(date.getSeconds())
    return timeString
  }
})
