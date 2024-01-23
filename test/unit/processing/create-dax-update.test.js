const { createDaxUpdate } = require('../../../app/processing/create-dax-update')

const daxData = require('../../mocks/dax-data')
const daxUpdate = require('../../mocks/dax-update')

describe('create dax update', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return correct XML structure (ignoring whitespace)', async () => {
    const result = await createDaxUpdate(daxData)
    expect(result.replace(/\s/g, '')).toBe(daxUpdate.replace(/\s/g, ''))
  })
})
