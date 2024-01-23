const { mapStreetAddress } = require('../../../app/processing/map-street-address')

const fileContent = require('../../mocks/file-content-manual-address')
const fileLookupContent = require('../../mocks/file-content-lookup-address')
const street1 = require('../../mocks/address-1')
const street2 = require('../../mocks/address-2')
const street3 = require('../../mocks/address-3')
const street4 = require('../../mocks/address-4')
const flatName = require('../../mocks/flat-name')
const buildingName = require('../../mocks/building-name')
const buildingNumberRange = require('../../mocks/building-number-range')
const street = require('../../mocks/street')

let address
let lookupAddress
describe('map street address', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    address = { ...fileContent.capparty[0].address[0] }
    lookupAddress = { ...fileLookupContent.capparty[0].address[0] }
  })

  test('should return correct address if all of street 1 - 4  provided', async () => {
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1} ${street2} ${street3} ${street4}`)
  })

  test('should return correct address if address4 missing', async () => {
    delete address.address4
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1} ${street2} ${street3}`)
  })

  test('should return correct address if address3&4 missing', async () => {
    delete address.address3
    delete address.address4
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1} ${street2}`)
  })

  test('should return correct address if only address1 present', async () => {
    delete address.address2
    delete address.address3
    delete address.address4
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1}`)
  })

  test('should return correct address if all of flatName, buildingName, buildingNumberRange, street provided', async () => {
    const result = await mapStreetAddress(lookupAddress)
    expect(result).toBe(`${flatName} ${buildingName} ${buildingNumberRange} ${street}`)
  })

  test('should return correct address if flatName, buildingName, street provided', async () => {
    delete lookupAddress.buildingNumberRange
    const result = await mapStreetAddress(lookupAddress)
    expect(result).toBe(`${flatName} ${buildingName} ${street}`)
  })

  test('should return correct address if flatName, buildingNumberRange, street provided', async () => {
    delete lookupAddress.buildingName
    const result = await mapStreetAddress(lookupAddress)
    expect(result).toBe(`${flatName} ${buildingNumberRange} ${street}`)
  })

  test('should return correct address if buildingName, buildingNumberRange, street provided', async () => {
    delete lookupAddress.flatName
    const result = await mapStreetAddress(lookupAddress)
    expect(result).toBe(`${buildingName} ${buildingNumberRange} ${street}`)
  })

  test('should return correct address if buildingName, street provided', async () => {
    delete lookupAddress.flatName
    delete lookupAddress.buildingNumberRange
    const result = await mapStreetAddress(lookupAddress)
    expect(result).toBe(`${buildingName} ${street}`)
  })

  test('should return correct address if buildbuildingNumberRangeingName, street provided', async () => {
    delete lookupAddress.flatName
    delete lookupAddress.buildingName
    const result = await mapStreetAddress(lookupAddress)
    expect(result).toBe(`${buildingNumberRange} ${street}`)
  })

  test('should return correct address if flatName, street provided', async () => {
    delete lookupAddress.buildingNumberRange
    delete lookupAddress.buildingName
    const result = await mapStreetAddress(lookupAddress)
    expect(result).toBe(`${flatName} ${street}`)
  })

  test('should return correct address if street provided', async () => {
    delete lookupAddress.flatName
    delete lookupAddress.buildingNumberRange
    delete lookupAddress.buildingName
    const result = await mapStreetAddress(lookupAddress)
    expect(result).toBe(`${street}`)
  })

  test('should return null if no address elements and no street', async () => {
    delete address.address1
    const result = await mapStreetAddress(address)
    expect(result).toBe(null)
  })
})
