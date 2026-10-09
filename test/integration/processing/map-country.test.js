const db = require('../../../app/database')
const { truncate } = require('../../helpers/truncate')
const { mapCountry } = require('../../../app/processing/map-country')
const country = require('../../mocks/country')
const countryCode = require('../../mocks/country-code')

let countryDB
describe('map country', () => {
  beforeEach(async () => {
    await truncate()
    countryDB = {
      countryId: 1,
      name: country,
      countryCode
    }
    await db.countries().insert(countryDB)
  })

  afterAll(async () => {
    await truncate()
    await db.close()
  })

  test('should get correct country code for given country', async () => {
    const result = await mapCountry(country)
    expect(result).toBe(countryCode)
  })

  test('should return null for non-existent country', async () => {
    const result = await mapCountry('Al Qolnidar')
    expect(result).toBe(null)
  })
})
