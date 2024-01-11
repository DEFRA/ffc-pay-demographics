const { createDaxData } = require('../../../app/processing/create-dax-data')

jest.mock('../../../app/processing/map-customer-group')
const { mapCustomerGroup: mockMapCustomerGroup } = require('../../../app/processing/map-customer-group')

jest.mock('../../../app/processing/map-country')
const { mapCountry: mockMapCountry } = require('../../../app/processing/map-country')

jest.mock('../../../app/processing/map-street-address')
const { mapStreetAddress: mockMapStreetAddress } = require('../../../app/processing/map-street-address')

const fileContent = require('../../mocks/file-content')
const vendGroup = require('../../mocks/vend-group')
const isTrader = require('../../mocks/is-trader')
const countryCode = require('../../mocks/country-code')
const street1 = require('../../mocks/street-1')
const street2 = require('../../mocks/street-2')
const street3 = require('../../mocks/street-3')
const street4 = require('../../mocks/street-4')
const country = require('../../mocks/country')
const addressRole = require('../../mocks/address-role')
const city = require('../../mocks/city')
const postCode = require('../../mocks/post-code')
const name = require('../../mocks/name')
const frn = require('../../mocks/frn')
const claimantGroup = require('../../mocks/claimant-group')
const email = require('../../mocks/email')

describe('create dax data', () => {
  const customer = fileContent.capparty[0]
  beforeEach(() => {
    jest.clearAllMocks()
    mockMapCustomerGroup.mockResolvedValue({ daxGroup: vendGroup, isTrader })
    mockMapCountry.mockResolvedValue(countryCode)
    mockMapStreetAddress.mockResolvedValue(`${street1} ${street2} ${street3} ${street4}`)
  })

  test('should obtain vendGroup and isTrader', async () => {
    await createDaxData(customer)
    expect(mockMapCustomerGroup).toHaveBeenCalledWith(frn, claimantGroup)
  })

  test('should obtain country code', async () => {
    await createDaxData(customer)
    expect(mockMapCountry).toHaveBeenCalledWith(country)
  })

  test('should obtain street address', async () => {
    await createDaxData(customer)
    expect(mockMapStreetAddress).toHaveBeenCalledWith(customer.address[0])
  })

  test('should return accountNum as FRN', async () => {
    const result = await createDaxData(customer)
    expect(result.accountNum).toBe(frn)
  })

  test('should return gsTraderEmail as email address', async () => {
    const result = await createDaxData(customer)
    expect(result.gsTraderEmail).toBe(email)
  })

  test('should return gsTraderStatus as Active if isTrader is 1', async () => {
    const result = await createDaxData(customer)
    expect(result.gsTraderStatus).toBe('Active')
  })

  test('should return gsTraderStatus as NotATrader if isTrader is 0', async () => {
    mockMapCustomerGroup.mockResolvedValue({ daxGroup: vendGroup, isTrader: 0 })
    const result = await createDaxData(customer)
    expect(result.gsTraderStatus).toBe('NotATrader')
  })

  test('should return vendGroup as vendGroup calculated from mapCustomerGroup', async () => {
    const result = await createDaxData(customer)
    expect(result.vendGroup).toBe(vendGroup)
  })

  test('should return name as calculated in mapName', async () => {
    const result = await createDaxData(customer)
    expect(result.name).toBe(name)
  })

  test('should return uniqueRecordDPPAddrRole as address type', async () => {
    const result = await createDaxData(customer)
    expect(result.uniqueRecordDPPAddrRole).toBe(addressRole)
  })

  test('should return city', async () => {
    const result = await createDaxData(customer)
    expect(result.city).toBe(city)
  })

  test('should return countryRegionId as the output of mapCountry', async () => {
    const result = await createDaxData(customer)
    expect(result.countryRegionId).toBe(countryCode)
  })

  test('should return roles as address type', async () => {
    const result = await createDaxData(customer)
    expect(result.roles).toBe(addressRole)
  })

  test('should return street as calculated in mapStreetAddress', async () => {
    const result = await createDaxData(customer)
    expect(result.street).toBe(`${street1} ${street2} ${street3} ${street4}`)
  })

  test('should return zipCode as postalCode', async () => {
    const result = await createDaxData(customer)
    expect(result.zipCode).toBe(postCode)
  })
})
