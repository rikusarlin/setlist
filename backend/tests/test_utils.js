const randomStr = function (length) {
  let radom13chars = function () {
    return Math.random().toString(16).substring(2, 15)
  }
  let loops = Math.ceil(length / 13)
  return new Array(loops)
    .fill(radom13chars)
    .reduce((string, func) => {
      return string + func()
    }, '')
    .substring(0, length)
}

module.exports = {
  randomStr,
}
