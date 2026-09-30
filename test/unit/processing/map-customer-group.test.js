const { createKnexMock, createQueryBuilder } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['claimantExceptions', 'claimantGroups'])

jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { mapCustomerGroup } = require('../../../app/processing/map-customer-group')
const businessTypeId = require('../../mocks/business-type-id')
const frn = require('../../mocks/frn')
const isTrader = require('../../mocks/is-trader')

const name = 'Albert Farmers and Friends'
const exception = { claimantExceptionId: 1, name, frn, claimantGroup: 'EXCP', isTrader }
const group = { claimantGroupId: 1, businessTypeId, rpGroup: name, daxGroup: 'GRP', isTrader: false }

describe('mapCustomerGroup', () => {
  let exceptionBuilder, groupBuilder

  beforeEach(() => {
    jest.clearAllMocks()
    exceptionBuilder = createQueryBuilder().resolves(exception)
    groupBuilder = createQueryBuilder().resolves(group)
    mockDb.tables.claimantExceptions.mockReturnValue(exceptionBuilder)
    mockDb.tables.claimantGroups.mockReturnValue(groupBuilder)
  })

  test('queries claimant exceptions by frn against the pool', async () => {
    await mapCustomerGroup(frn, businessTypeId)
    expect(mockDb.tables.claimantExceptions).toHaveBeenCalledWith()
    expect(exceptionBuilder.where).toHaveBeenCalledWith({ frn })
    expect(exceptionBuilder.first).toHaveBeenCalledTimes(1)
  })

  test('returns daxGroup and isTrader from the exception without querying groups', async () => {
    const result = await mapCustomerGroup(frn, businessTypeId)
    expect(result).toEqual({ daxGroup: 'EXCP', isTrader })
    expect(mockDb.tables.claimantGroups).not.toHaveBeenCalled()
  })

  test('falls back to claimant groups by businessTypeId against the pool if no exception', async () => {
    exceptionBuilder.resolves(undefined)
    const result = await mapCustomerGroup(frn, businessTypeId)
    expect(mockDb.tables.claimantGroups).toHaveBeenCalledWith()
    expect(groupBuilder.where).toHaveBeenCalledWith({ businessTypeId })
    expect(groupBuilder.first).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ daxGroup: 'GRP', isTrader: false })
  })

  test('queries claimant groups only if no frn', async () => {
    const result = await mapCustomerGroup(undefined, businessTypeId)
    expect(mockDb.tables.claimantExceptions).not.toHaveBeenCalled()
    expect(result).toEqual({ daxGroup: 'GRP', isTrader: false })
  })

  test('does not query claimant groups if no businessTypeId', async () => {
    exceptionBuilder.resolves(undefined)
    const result = await mapCustomerGroup(frn, undefined)
    expect(mockDb.tables.claimantGroups).not.toHaveBeenCalled()
    expect(result).toBe(null)
  })

  test('returns null without querying if no frn or businessTypeId', async () => {
    const result = await mapCustomerGroup(undefined, undefined)
    expect(mockDb.tables.claimantExceptions).not.toHaveBeenCalled()
    expect(mockDb.tables.claimantGroups).not.toHaveBeenCalled()
    expect(result).toBe(null)
  })

  test('returns null for non-existent exception and group', async () => {
    exceptionBuilder.resolves(undefined)
    groupBuilder.resolves(undefined)
    const result = await mapCustomerGroup('9876543210', '95292')
    expect(result).toBe(null)
  })

  test('propagates a database failure', async () => {
    exceptionBuilder.rejects(new Error('DB error'))
    await expect(mapCustomerGroup(frn, businessTypeId)).rejects.toThrow('DB error')
  })
})
