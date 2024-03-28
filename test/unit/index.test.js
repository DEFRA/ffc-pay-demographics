jest.mock('../../app/processing')
const { start: mockStart } = require('../../app/processing')

jest.mock('../../app/server')
const { start: mockServStart } = require('../../app/server')

describe('start', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('should start server', () => {
    expect(mockServStart).toHaveBeenCalled()
  })

  test('should start processing', () => {
    expect(mockStart).toHaveBeenCalled()
  })
})
