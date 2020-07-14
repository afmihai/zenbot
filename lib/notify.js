module.exports = function notifier(conf) {
  const active_notifiers = []
  const interactive_notifiers = []

  for (let notifier in conf.notifiers) {
    if (conf.notifiers[notifier].on) {
      const notif = require(`../extensions/notifiers/${notifier}`)(
        conf.notifiers[notifier]
      )
      notif.notifier_name = notifier

      active_notifiers.push(notif)
      if (conf.notifiers[notifier].interactive) {
        interactive_notifiers.push(notif)
      }
    }
  }

  return {
    pushMessage: function (title, message) {
      if (conf.debug) {
        console.log(`${title}: ${message}`)
      }

      active_notifiers.forEach(notifier => {
        if (conf.debug) {
          console.log(`Sending push message via ${notifier.notifier_name}`)
        }
        notifier.pushMessage(title, message)
      })
    },
    onMessage: function (callback) {
      interactive_notifiers.forEach(notifier => {
        if (conf.debug) {
          console.log(`Receiving message from ${notifier.notifier_name}`)
        }
        notifier.onMessage(callback)
      })
    },
  }
}
