const { createCustomerUpdate } = require('../../../app/processing/create-customer-update')

jest.mock('../../../app/processing/map-customer-group')
const { mapCustomerGroup: mockMapCustomerGroup } = require('../../../app/processing/map-customer-group')

jest.mock('../../../app/processing/map-country')
const { mapCountry: mockMapCountry } = require('../../../app/processing/map-country')

jest.mock('../../../app/processing/map-street-address')
const { mapStreetAddress: mockMapStreetAddress } = require('../../../app/processing/map-street-address')

jest.mock('../../../app/processing/map-name')
const { mapName: mockMapName } = require('../../../app/processing/map-name')

const fileContent = require('../../mocks/file-content')
const vendGroup = require('../../mocks/vend-group')
const isTrader = require('../../mocks/is-trader')
const frn = require('../../mocks/frn')
const countryCode = require('../../mocks/country-code')
const street1 = require('../../mocks/street-1')
const street2 = require('../../mocks/street-2')
const street3 = require('../../mocks/street-3')
const street4 = require('../../mocks/street-4')
const title = require('../../mocks/title')
const firstName = require('../../mocks/first-name')
const middleName = require('../../mocks/middle-name')
const lastName = require('../../mocks/last-name')
const country = require('../../mocks/country')
const addressRole = require('../../mocks/address-role')
const city = require('../../mocks/city')
const postCode = require('../../mocks/post-code')

describe('create customer update', () => {
  const customer = fileContent.capparty[0]
  beforeEach(() => {
    jest.clearAllMocks()
    mockMapCustomerGroup.mockResolvedValue({ daxGroup: vendGroup, isTrader })
    mockMapCountry.mockResolvedValue(countryCode)
    mockMapStreetAddress.mockResolvedValue(`${street1} ${street2} ${street3} ${street4}`)
    mockMapName.mockResolvedValue(`${title} ${firstName} ${middleName} ${lastName}`)
  })

  test('should obtain vendGroup and isTrader', async () => {
    await createCustomerUpdate(customer)
    // stop gap string while waiting for where this comes from
    expect(mockMapCustomerGroup).toHaveBeenCalledWith(frn, 'Claimant Group')
  })

  test('should obtain country code', async () => {
    await createCustomerUpdate(customer)
    expect(mockMapCountry).toHaveBeenCalledWith(country)
  })

  test('should obtain street address', async () => {
    await createCustomerUpdate(customer)
    expect(mockMapStreetAddress).toHaveBeenCalledWith(customer.address[0])
  })

  test('should obtain full name', async () => {
    await createCustomerUpdate(customer)
    expect(mockMapName).toHaveBeenCalledWith(customer.person)
  })

  test('should return accountNum as FRN', async () => {
    const result = await createCustomerUpdate(customer)
    // exact ref may need to change as per discussion with John
    expect(result.accountNum).toBe(frn)
  })

  test('should return gsTraderEmail as email address', async () => {
    const result = await createCustomerUpdate(customer)
    // placeholder - not currently clear where email comes from
    expect(result.gsTraderEmail).toBe('emailAddress')
  })

  test('should return gsTraderStatus as Active if isTrader is 1', async () => {
    const result = await createCustomerUpdate(customer)
    expect(result.gsTraderStatus).toBe('Active')
  })

  test('should return gsTraderStatus as NotATrader if isTrader is 0', async () => {
    mockMapCustomerGroup.mockResolvedValue({ daxGroup: vendGroup, isTrader: 0 })
    const result = await createCustomerUpdate(customer)
    expect(result.gsTraderStatus).toBe('NotATrader')
  })

  test('should return vendGroup as vendGroup calculated from mapCustomerGroup', async () => {
    const result = await createCustomerUpdate(customer)
    expect(result.vendGroup).toBe(vendGroup)
  })

  test('should return name as calculated in mapName', async () => {
    const result = await createCustomerUpdate(customer)
    expect(result.name).toBe(`${title} ${firstName} ${middleName} ${lastName}`)
  })

  test('should return uniqueRecordDPPAddrRole as address type', async () => {
    const result = await createCustomerUpdate(customer)
    expect(result.uniqueRecordDPPAddrRole).toBe(addressRole)
  })

  test('should return city', async () => {
    const result = await createCustomerUpdate(customer)
    expect(result.city).toBe(city)
  })

  test('should return countryRegionId as the output of mapCountry', async () => {
    const result = await createCustomerUpdate(customer)
    expect(result.countryRegionId).toBe(countryCode)
  })

  test('should return roles as address type', async () => {
    const result = await createCustomerUpdate(customer)
    expect(result.roles).toBe(addressRole)
  })

  test('should return street as calculated in mapStreetAddress', async () => {
    const result = await createCustomerUpdate(customer)
    expect(result.street).toBe(`${street1} ${street2} ${street3} ${street4}`)
  })

  test('should return zipCode as postalCode', async () => {
    const result = await createCustomerUpdate(customer)
    expect(result.zipCode).toBe(postCode)
  })
})
