module.exports = function (selector) {
  const parts = selector.split('.')
  return parts[0].toLowerCase() + '.' + (parts[1] || '').toUpperCase()
}
