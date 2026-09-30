const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['countries'])

jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { mapCountry } = require('../../../app/processing/map-country')
const country = require('../../mocks/country')
const countryCode = require('../../mocks/country-code')

describe('map country', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves({ countryId: 1, name: country, countryCode })
  })

  test('queries countries by name against the pool', async () => {
    await mapCountry(country)
    expect(mockDb.tables.countries).toHaveBeenCalledWith()
    expect(mockDb.builder.where).toHaveBeenCalledWith({ name: country })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
  })

  test('should get correct country code for given country', async () => {
    const result = await mapCountry(country)
    expect(result).toBe(countryCode)
  })

  test('should return null for non-existent country', async () => {
    mockDb.builder.resolves(undefined)
    const result = await mapCountry('Al Qolnidar')
    expect(result).toBe(null)
  })

  test('propagates a database failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))
    await expect(mapCountry(country)).rejects.toThrow('DB error')
  })
})
