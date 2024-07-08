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
const mockLogTimestamp = require('log-timestamp')
const { start: mockProcessingStart } = require('../../app/processing')
const { start: mockMessagingStart, stop: mockMessagingStop } = require('../../app/messaging')

describe('app', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    require('../../app')
  })

  test('should setup insights', () => {
    expect(mockSetup).toHaveBeenCalled()
  })

  test('should require log-timestamp', () => {
    expect(mockLogTimestamp).toHaveBeenCalled()
  })

  test('should start processing', () => {
    expect(mockProcessingStart).toHaveBeenCalled()
  })

  test('should start messaging', () => {
    expect(mockMessagingStart).toHaveBeenCalled()
  })

  test('should stop messaging and exit on SIGTERM', async () => {
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {})
    const eventHandlers = process.listeners('SIGTERM')

    for (const handler of eventHandlers) {
      await handler()
    }

    expect(mockMessagingStop).toHaveBeenCalled()
    expect(processExitSpy).toHaveBeenCalledWith(0)

    processExitSpy.mockRestore()
  })

  test('should stop messaging and exit on SIGINT', async () => {
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {})
    const eventHandlers = process.listeners('SIGINT')

    for (const handler of eventHandlers) {
      await handler()
    }

    expect(mockMessagingStop).toHaveBeenCalled()
    expect(processExitSpy).toHaveBeenCalledWith(0)

    processExitSpy.mockRestore()
  })
})
