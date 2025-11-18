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

describe('mapStreetAddress', () => {
  const manualAddress = fileContent.capparty[0].address[0]
  const lookupAddress = fileLookupContent.capparty[0].address[0]

  const testCases = [
    ['all street1-4', { ...manualAddress }, `${street1} ${street2} ${street3} ${street4}`],
    ['missing address4', { ...manualAddress, address4: undefined }, `${street1} ${street2} ${street3}`],
    ['missing address3 & 4', { ...manualAddress, address3: undefined, address4: undefined }, `${street1} ${street2}`],
    ['only address1', { ...manualAddress, address2: undefined, address3: undefined, address4: undefined }, `${street1}`],
    ['all flat/building/street', { ...lookupAddress }, `${flatName} ${buildingName} ${buildingNumberRange} ${street}`],
    ['flat, building, street', { ...lookupAddress, buildingNumberRange: undefined }, `${flatName} ${buildingName} ${street}`],
    ['flat, buildingNumberRange, street', { ...lookupAddress, buildingName: undefined }, `${flatName} ${buildingNumberRange} ${street}`],
    ['buildingName, buildingNumberRange, street', { ...lookupAddress, flatName: undefined }, `${buildingName} ${buildingNumberRange} ${street}`],
    ['buildingName, street', { ...lookupAddress, flatName: undefined, buildingNumberRange: undefined }, `${buildingName} ${street}`],
    ['buildingNumberRange, street', { ...lookupAddress, flatName: undefined, buildingName: undefined }, `${buildingNumberRange} ${street}`],
    ['flatName, street', { ...lookupAddress, buildingNumberRange: undefined, buildingName: undefined }, `${flatName} ${street}`],
    ['street only', { ...lookupAddress, flatName: undefined, buildingNumberRange: undefined, buildingName: undefined }, `${street}`],
    ['no elements', { address1: undefined }, null]
  ]

  test.each(testCases)('should return correct address for %s', async (_, input, expected) => {
    const clonedInput = { ...input }
    const result = await mapStreetAddress(clonedInput)
    expect(result).toBe(expected)
  })
})
