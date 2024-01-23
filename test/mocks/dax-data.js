const addressRole = require('./address-role')
const city = require('./city')
const countryCode = require('./country-code')
const email = require('./email')
const frn = require('./frn')
const isTrader = require('./is-trader')
const name = require('./name')
const postCode = require('./post-code')
const street1 = require('./address-1')
const street2 = require('./address-2')
const street3 = require('./address-3')
const street4 = require('./address-4')
const vendGroup = require('./vend-group')

module.exports = {
  accountNum: frn,
  gsTraderEmail: email,
  gsTraderStatus: Number(isTrader) === 1 ? 'Active' : 'NotATrader',
  vendGroup,
  name,
  uniqueRecordDPPAddrRole: addressRole,
  city,
  countryRegionId: countryCode,
  roles: addressRole,
  street: `${street1} ${street2} ${street3} ${street4}`,
  zipCode: postCode
}
