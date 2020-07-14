const normalizeSelector = require('./normalize-selector')

module.exports = function (selector) {
  let rtn

  if (typeof selector == 'string') {
    const s = normalizeSelector(selector)

    const e_id = s.split('.')[0]
    const p_id = s.split('.')[1]
    const asset = p_id.split('-')[0]
    const currency = p_id.split('-')[1]

    rtn = {
      exchange_id: e_id,
      product_id: p_id,
      asset: asset,
      currency: currency,
      normalized: s,
    }
  } else if (typeof selector == 'object') {
    rtn = selector
  }

  return rtn
}
