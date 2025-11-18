const db = require('../../../app/data')
const { mapCustomerGroup } = require('../../../app/processing/map-customer-group')
const businessTypeId = require('../../mocks/business-type-id')
const frn = require('../../mocks/frn')
const isTrader = require('../../mocks/is-trader')

describe('mapCustomerGroup', () => {
  let excepDB, grpDB, name

  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
    name = 'Albert Farmers and Friends'

    excepDB = { claimantExceptionId: 1, name, frn, claimantGroup: 'ABCD', isTrader }
    grpDB = { claimantGroupId: 1, businessTypeId, rpGroup: name, daxGroup: 'ABCD', isTrader }

    await db.claimantException.create(excepDB)
    await db.claimantGroup.create(grpDB)
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test.each([
    ['exception db', frn, businessTypeId, 'ABCD', isTrader],
    ['groups db fallback', '9876543210', businessTypeId, 'ABCD', isTrader]
  ])(
    'should get correct daxGroup and isTrader from %s',
    async (_, testFrn, testBusinessTypeId, expectedGroup, expectedTrader) => {
      const result = await mapCustomerGroup(testFrn, testBusinessTypeId)
      expect(result.daxGroup).toBe(expectedGroup)
      expect(result.isTrader).toBe(expectedTrader)
    }
  )

  test('should return null for non-existent exception and group', async () => {
    const result = await mapCustomerGroup('9876543210', '95292')
    expect(result).toBe(null)
  })
})
