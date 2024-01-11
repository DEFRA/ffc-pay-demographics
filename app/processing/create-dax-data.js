const joi = require('joi')
const { mapCustomerGroup } = require('./map-customer-group')
const { mapCountry } = require('./map-country')
const { mapStreetAddress } = require('./map-street-address')

const createDaxData = async (customer) => {
  // currently unclear where frn comes from. so if check will not trigger.
  const frn = customer.organisation.frn
  // currently unclear where Claimant Group comes from.
  const group = await mapCustomerGroup(frn, customer.organisation.claimantGroup)
  const address = customer.address[0]
  const countryRegionId = await mapCountry(address.country)
  const street = await mapStreetAddress(address)
  const customerUpdate = {
    accountNum: frn,
    gsTraderEmail: customer.digitalContact[0].digitalAddress,
    gsTraderStatus: group ? (Number(group.isTrader) === 1 ? 'Active' : 'NotATrader') : null,
    vendGroup: group?.daxGroup,
    // pending confirmation where name comes from
    name: customer.organisation.name,
    uniqueRecordDPPAddrRole: address.addressType,
    city: address.city,
    countryRegionId,
    roles: address.addressType,
    street,
    zipCode: address.postalCode
  }
  const isValid = schema.validate(customerUpdate, {
    abortEarly: false
  })
  if (isValid.error) {
    throw new Error(`The received customer data is invalid. ${isValid.error.message}`)
  }
  return customerUpdate
}

const schema = joi.object({
  accountNum: joi.string().min(10).max(10).required(),
  gsTraderEmail: joi.string().email().required(),
  gsTraderStatus: joi.string().valid('Active', 'NotATrader').required(),
  vendGroup: joi.string().required(),
  name: joi.string().required(),
  uniqueRecordDPPAddrRole: joi.string().required(),
  city: joi.string().required(),
  countryRegionId: joi.string().min(2).max(3).required(),
  roles: joi.string().required(),
  street: joi.string().required(),
  zipCode: joi.string().required()
})

module.exports = {
  createDaxData
}
