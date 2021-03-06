// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const fs = require('fs')

module.exports = function (program) {
  program
    .command('list-selectors')
    .description('list available selectors')
    .action(function (/*cmd*/) {
      const exchanges = fs.readdirSync('./extensions/exchanges')
      exchanges.forEach(function (exchange) {
        if (exchange === 'sim' || exchange === '_stub') return

        console.log(`${exchange}:`)
        const products = require(`../extensions/exchanges/${exchange}/products.json`)
        products.sort(function (a, b) {
          if (a.asset < b.asset) return -1
          if (a.asset > b.asset) return 1
          if (a.currency < b.currency) return -1
          if (a.currency > b.currency) return 1
          return 0
        })
        products.forEach(function (p) {
          console.log(
            '  ' +
              exchange.cyan +
              '.'.grey +
              p.asset.green +
              '-'.grey +
              p.currency.cyan +
              (p.label ? ('   (' + p.label + ')').grey : '')
          )
        })
      })
      process.exit()
    })
}
