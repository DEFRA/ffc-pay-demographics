const { createDemographicsUpdate } = require('../../../app/processing/create-demographics-update')

const fileContent = require('../../mocks/file-content')

describe('create demographics update', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return same content', async () => {
    const result = await createDemographicsUpdate(fileContent)
    expect(result).toBe(fileContent)
  })
})
