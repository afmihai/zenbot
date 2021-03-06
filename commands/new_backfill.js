const minimist = require('minimist')
const tb = require('timebucket')
const exchangeService = require('../lib/services/exchange-service')
const objectifySelector = require('../lib/objectify-selector')
const backfillFunction = require('./backfill/backfill.function')

module.exports = function (program, conf) {
  program
    .command('new_backfill [selector]')
    .description('download historical trades for analysis')
    .option(
      '-d, --days <days>',
      'number of days to acquire (default: ' + conf.days + ')',
      Number,
      conf.days
    )
    .action(function (selector, cmd) {
      const s = { options: minimist(process.argv) }
      const so = s.options
      delete so._
      Object.keys(conf).forEach(function (k) {
        if (typeof cmd[k] !== 'undefined') {
          so[k] = cmd[k]
        }
      })

      conf.selector = objectifySelector(selector || conf.selector)

      const exchangeServiceInstance = exchangeService(conf)
      const exchange = exchangeServiceInstance.getExchange()
      const exchangeName = exchange.name // TODO: Refactor all exchanges to be in the format of the stub.exchange, so we can use getName() here.

      if (exchange === undefined) {
        console.error(
          "\nSorry, couldn't find an exchange named [" + exchangeName + '].'
        )
        process.exit(1)
      }

      if (!exchange.historyScan) {
        console.error(
          '\ncannot backfill ' +
            exchangeName +
            ': exchange does not offer historical data'
        )
        process.exit(1)
      }

      if (exchange !== undefined) {
        let msg =
          "Hitting up the exchange '" +
          exchangeName +
          "' for trades within the past " +
          so.days +
          ' day'
        if (so.days > 1) {
          msg += 's.'
        } else {
          msg += '.'
        }

        console.log('*************************')
        console.log(msg)
        console.log('*************************')
        console.log('\n\nBackfilling...\n\n')

        const targetTime = tb(new Date().getTime())
          .resize('1d')
          .subtract(so.days)
          .toMilliseconds()
        const backfillFunctionInstance = backfillFunction(conf)
        backfillFunctionInstance(targetTime).then(
          finalTradeId => {
            process.stdout.write('\n\n')
            // TODO: Make this say: "Done. Last processed trade happened on January 37, 2018 10:02
            //  will have to call the DB, get the trade finalTradeId, and display its time.
            console.log(
              'final trade id ==> [' + JSON.stringify(finalTradeId) + ']'
            )
            process.exit(0)
          },
          err => {
            console.log('error. ' + err)
          }
        )
      }
    })
}
