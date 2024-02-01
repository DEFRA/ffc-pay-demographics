const db = require('../../../app/data')
const { mapCustomerGroup } = require('../../../app/processing/map-customer-group')
const businessTypeId = require('../../mocks/business-type-id')
const frn = require('../../mocks/frn')
const isTrader = require('../../mocks/is-trader')

let excepDB
let grpDB
let name
describe('map customer group', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
    name = 'Albert Farmers and Friends'
    excepDB = {
      claimantExceptionId: 1,
      name,
      frn,
      claimantGroup: 'ABCD',
      isTrader
    }
    grpDB = {
      claimantGroupId: 1,
      businessTypeId,
      rpGroup: name,
      daxGroup: 'ABCD',
      isTrader
    }
    await db.claimantException.create(excepDB)
    await db.claimantGroup.create(grpDB)
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should get correct daxGroup if present in exceptions db', async () => {
    const result = await mapCustomerGroup(frn, businessTypeId)
    expect(result.daxGroup).toBe('ABCD')
  })

  test('should get correct isTrader if present in exceptions db', async () => {
    const result = await mapCustomerGroup(frn, businessTypeId)
    expect(result.isTrader).toBe(isTrader)
  })

  test('should get correct daxGroup if not present in exceptions db, present in groups', async () => {
    const result = await mapCustomerGroup('9876543210', businessTypeId)
    expect(result.daxGroup).toBe('ABCD')
  })

  test('should get correct isTrader if not present in exceptions db, present in groups', async () => {
    const result = await mapCustomerGroup('9876543210', businessTypeId)
    expect(result.isTrader).toBe(isTrader)
  })

  test('should return null for non-existent exception and group', async () => {
    const result = await mapCustomerGroup('9876543210', '95292')
    expect(result).toBe(null)
  })
})
