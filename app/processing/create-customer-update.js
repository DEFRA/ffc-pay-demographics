const { mapCustomerGroup } = require('./map-customer-group')
const { mapCountry } = require('./map-country')
const { mapName } = require('./map-name')
const { mapStreetAddress } = require('./map-street-address')

const createCustomerUpdate = async (customer) => {
  // unsure this is the frn, need to clarify. does not appear to be.
  const frn = customer.person.customerReference
  // currently unclear where Claimant Group comes from.
  const { daxGroup, isTrader } = await mapCustomerGroup(frn, 'Claimant Group')
  const address = customer.address[0]
  const countryRegionId = await mapCountry(address.country)
  const street = await mapStreetAddress(address)
  return {
    accountNum: frn,
    // not entirely clear where the email address is actually coming from based on sample file. asked for clarification on 'digitalContact' section
    gsTraderEmail: 'emailAddress',
    gsTraderStatus: Number(isTrader) === 1 ? 'Active' : 'NotATrader',
    vendGroup: daxGroup,
    name: await mapName(customer.person),
    uniqueRecordDPPAddrRole: address.addressType,
    city: address.city,
    countryRegionId,
    roles: address.addressType,
    street,
    zipCode: address.postalCode
  }
}

module.exports = {
  createCustomerUpdate
}
