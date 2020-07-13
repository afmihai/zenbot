const request = require('request')

module.exports = function pushover (config) {
  const pushover = {
    pushMessage: function (title, message) {
      const postData = {
        'token': config.token,
        'user': config.user,
        'title': title,
        'message': message,
        'priority': config.priority
      }

      function callback(error) {
        if (error) {
          console.log('Error happened: ' + error)
        }
      }

      const options = {
        method: 'POST',
        url: 'https://api.pushover.net/1/messages.json',
        json: postData
      }

      request(options, callback)
    }
  }
  return pushover
}
