const { createDaxData } = require('../../../app/processing/create-dax-data')

jest.mock('../../../app/processing/map-customer-group')
const { mapCustomerGroup: mockMapCustomerGroup } = require('../../../app/processing/map-customer-group')

jest.mock('../../../app/processing/map-country')
const { mapCountry: mockMapCountry } = require('../../../app/processing/map-country')

jest.mock('../../../app/processing/map-street-address')
const { mapStreetAddress: mockMapStreetAddress } = require('../../../app/processing/map-street-address')

const fileContent = require('../../mocks/file-content-manual-address')
const vendGroup = require('../../mocks/vend-group')
const isTraderDefault = require('../../mocks/is-trader')
const countryCode = require('../../mocks/country-code')
const street1 = require('../../mocks/address-1')
const street2 = require('../../mocks/address-2')
const street3 = require('../../mocks/address-3')
const street4 = require('../../mocks/address-4')
const country = require('../../mocks/country')
const addressRole = require('../../mocks/address-role')
const city = require('../../mocks/city')
const postCode = require('../../mocks/post-code')
const name = require('../../mocks/name')
const frn = require('../../mocks/frn')
const email = require('../../mocks/email')
const businessTypeId = require('../../mocks/business-type-id')

describe('createDaxData', () => {
  const customer = fileContent.capparty[0]
  let result

  beforeEach(async () => {
    jest.clearAllMocks()
    mockMapCustomerGroup.mockResolvedValue({ daxGroup: vendGroup, isTrader: isTraderDefault })
    mockMapCountry.mockResolvedValue(countryCode)
    mockMapStreetAddress.mockResolvedValue(`${street1} ${street2} ${street3} ${street4}`)
    result = await createDaxData(customer)
  })

  test('obtains vendGroup and isTrader', () => {
    expect(mockMapCustomerGroup).toHaveBeenCalledWith(frn, businessTypeId)
  })

  test('obtains country code', () => {
    expect(mockMapCountry).toHaveBeenCalledWith(country)
  })

  test('obtains street address', () => {
    expect(mockMapStreetAddress).toHaveBeenCalledWith(customer.address[0])
  })

  test('returns correct fields', () => {
    expect(result.accountNum).toBe(frn)
    expect(result.gsTraderEmail).toBe(email)
    expect(result.gsTraderStatus).toBe(isTraderDefault ? 'Active' : 'NotATrader')
    expect(result.vendGroup).toBe(vendGroup)
    expect(result.name).toBe(name)
    expect(result.uniqueRecordDPPAddrRole).toBe(addressRole)
    expect(result.roles).toBe(addressRole)
    expect(result.city).toBe(city)
    expect(result.countryRegionId).toBe(countryCode)
    expect(result.street).toBe(`${street1} ${street2} ${street3} ${street4}`)
    expect(result.zipCode).toBe(postCode)
  })

  test('gsTraderStatus is NotATrader if isTrader is false', async () => {
    mockMapCustomerGroup.mockResolvedValue({ daxGroup: vendGroup, isTrader: false })
    const res = await createDaxData(customer)
    expect(res.gsTraderStatus).toBe('NotATrader')
  })
})
