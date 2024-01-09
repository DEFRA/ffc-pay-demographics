const { createDaxUpdate } = require('../../../app/processing/create-dax-update')

const customerContent = require('../../mocks/customer-content')
const daxUpdate = require('../../mocks/dax-update')

describe('create dax update', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return correct XML structure (ignoring whitespace)', async () => {
    const result = await createDaxUpdate(customerContent)
    expect(result.replace(/\s/g, '')).toBe(daxUpdate.replace(/\s/g, ''))
  })
})
