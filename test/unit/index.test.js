jest.mock('../../app/insights', () => ({
  setup: jest.fn()
}))
jest.mock('log-timestamp', () => jest.fn())
jest.mock('../../app/processing', () => ({
  start: jest.fn()
}))
jest.mock('../../app/messaging', () => ({
  start: jest.fn(),
  stop: jest.fn()
}))

const { setup: mockSetup } = require('../../app/insights')
const { start: mockProcessingStart } = require('../../app/processing')
const { start: mockMessagingStart } = require('../../app/messaging')

describe('app', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    jest.isolateModules(() => {
      require('../../app')
    })
  })

  test('should setup insights', () => {
    expect(mockSetup).toHaveBeenCalled()
  })

  test('should start processing', () => {
    expect(mockProcessingStart).toHaveBeenCalled()
  })

  test('should start messaging', () => {
    expect(mockMessagingStart).toHaveBeenCalled()
  })
})
