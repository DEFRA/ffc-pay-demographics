const { processingConfig } = require('../../app/config')

jest.mock('log-timestamp', () => jest.fn())
jest.mock('../../app/insights', () => ({
  setup: jest.fn()
}))
const { setup: mockSetup } = require('../../app/insights')
jest.mock('../../app/processing')
const { start: mockProcessingStart } = require('../../app/processing')
jest.mock('../../app/messaging')
const { start: mockMessagingStart } = require('../../app/messaging')

jest.mock('../../app/storage.js')
const { initialiseContainers: mockInitialiseContainers } = require('../../app/storage')

const startApp = require('../../app')

describe('app start', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('setup insights', async () => {
    jest.isolateModules(() => {
      require('../../app')
    })
    expect(mockSetup).toHaveBeenCalled()
  })

  test('initialises containers when active is true', async () => {
    processingConfig.processingActive = true
    await startApp()
    expect(mockInitialiseContainers).toHaveBeenCalledTimes(1)
  })

  test('does not initialise containers when active is false', async () => {
    processingConfig.processingActive = false
    await startApp()
    expect(mockInitialiseContainers).toHaveBeenCalledTimes(0)
  })

  test('starts processing when active is true', async () => {
    processingConfig.processingActive = true
    await startApp()
    expect(mockProcessingStart).toHaveBeenCalledTimes(1)
  })

  test('does not start processing when active is false', async () => {
    processingConfig.processingActive = false
    await startApp()
    expect(mockProcessingStart).toHaveBeenCalledTimes(0)
  })

  test('starts messaging when active is true', async () => {
    processingConfig.processingActive = true
    await startApp()
    expect(mockMessagingStart).toHaveBeenCalledTimes(1)
  })

  test('does not start messaging when active is false', async () => {
    processingConfig.processingActive = false
    await startApp()
    expect(mockMessagingStart).toHaveBeenCalledTimes(0)
  })

  test('does not log console.info when processingActive is true', async () => {
    processingConfig.processingActive = true
    const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    await startApp()
    expect(consoleInfoSpy).not.toHaveBeenCalled()
    consoleInfoSpy.mockRestore()
  })

  test('logs console.info when processingActive is false', async () => {
    processingConfig.processingActive = false
    const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    await startApp()
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Processing capabilities are currently not enabled in this environment')
    )
    consoleInfoSpy.mockRestore()
  })
})
