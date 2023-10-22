jest.mock('../../app/transfer')
const { start: mockStart } = require('../../app/transfer')

describe('start', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('should start transfers', () => {
    expect(mockStart).toHaveBeenCalled()
  })
})
