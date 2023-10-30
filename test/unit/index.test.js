jest.mock('../../app/processing')
const { start: mockStart } = require('../../app/processing')

describe('start', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('should start processing', () => {
    expect(mockStart).toHaveBeenCalled()
  })
})
