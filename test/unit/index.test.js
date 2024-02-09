jest.mock('../../app/processing')
const { start: mockStart } = require('../../app/processing')

jest.mock('../../app/messaging')
const { start: mockMsgStart } = require('../../app/messaging')

describe('start', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('should start messaging', () => {
    expect(mockMsgStart).toHaveBeenCalled()
  })

  test('should start processing', () => {
    expect(mockStart).toHaveBeenCalled()
  })
})
