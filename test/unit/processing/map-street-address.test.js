const { mapStreetAddress } = require('../../../app/processing/map-street-address')

const fileContent = require('../../mocks/file-content')
const street1 = require('../../mocks/street-1')
const street2 = require('../../mocks/street-2')
const street3 = require('../../mocks/street-3')
const street4 = require('../../mocks/street-4')

let address
describe('map street address', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    address = { ...fileContent.capparty[0].address[0] }
  })

  test('should return correct street if all of street 1 - 4  provided', async () => {
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1} ${street2} ${street3} ${street4}`)
  })

  test('should return correct street if address1 missing', async () => {
    delete address.address1
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street2} ${street3} ${street4}`)
  })

  test('should return correct street if address2 missing', async () => {
    delete address.address2
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1} ${street3} ${street4}`)
  })

  test('should return correct street if address3 missing', async () => {
    delete address.address3
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1} ${street2} ${street4}`)
  })

  test('should return correct street if address4 missing', async () => {
    delete address.address4
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1} ${street2} ${street3}`)
  })

  test('should return correct street if address1&2 missing', async () => {
    delete address.address1
    delete address.address2
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street3} ${street4}`)
  })

  test('should return correct street if address1&3 missing', async () => {
    delete address.address1
    delete address.address3
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street2} ${street4}`)
  })

  test('should return correct street if address1&4 missing', async () => {
    delete address.address1
    delete address.address4
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street2} ${street3}`)
  })

  test('should return correct street if address2&3 missing', async () => {
    delete address.address2
    delete address.address3
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1} ${street4}`)
  })

  test('should return correct street if address2&4 missing', async () => {
    delete address.address2
    delete address.address4
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1} ${street3}`)
  })

  test('should return correct street if address3&4 missing', async () => {
    delete address.address3
    delete address.address4
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1} ${street2}`)
  })

  test('should return correct street if only address1 present', async () => {
    delete address.address2
    delete address.address3
    delete address.address4
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street1}`)
  })

  test('should return correct street if only address2 present', async () => {
    delete address.address1
    delete address.address3
    delete address.address4
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street2}`)
  })

  test('should return correct street if only address3 present', async () => {
    delete address.address1
    delete address.address2
    delete address.address4
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street3}`)
  })

  test('should return correct street if only address4 present', async () => {
    delete address.address1
    delete address.address2
    delete address.address3
    const result = await mapStreetAddress(address)
    expect(result).toBe(`${street4}`)
  })

  test('should return empty string if no street elements', async () => {
    delete address.address1
    delete address.address2
    delete address.address3
    delete address.address4
    const result = await mapStreetAddress(address)
    expect(result).toBe('')
  })
})
