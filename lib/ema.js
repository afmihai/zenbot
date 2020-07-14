module.exports = function ema (s, key, length, source_key) {
  if (!source_key) source_key = 'close'
  if (s.lookback.length >= length) {
    let prev_ema = s.lookback[0][key]
    if (typeof prev_ema === 'undefined' || isNaN(prev_ema)) {
      let sum = 0
      s.lookback.slice(0, length).forEach(function (period) {
        sum += period[source_key]
      })
      prev_ema = sum / length
    }
    const multiplier = 2 / (length + 1)
    s.period[key] = (s.period[source_key] - prev_ema) * multiplier + prev_ema
  }
}

