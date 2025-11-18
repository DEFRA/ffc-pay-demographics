const { processingConfig } = require('../../app/config')

jest.mock('log-timestamp', () => jest.fn())

jest.mock('../../app/insights', () => ({ setup: jest.fn() }))
const { setup: mockSetup } = require('../../app/insights')

jest.mock('../../app/server')
const { start: mockStartServer } = require('../../app/server')

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

  test('should setup insights', async () => {
    jest.isolateModules(() => require('../../app'))
    expect(mockSetup).toHaveBeenCalled()
  })

  describe.each([
    { active: true, expectedInit: 1 },
    { active: false, expectedInit: 0 }
  ])('when processingActive is $active', ({ active, expectedInit }) => {
    beforeEach(() => {
      processingConfig.processingActive = active
    })

    test('starts server', async () => {
      await startApp()
      expect(mockStartServer).toHaveBeenCalled()
    })

    test(`initialises containers ${expectedInit ? 'once' : 'not at all'}`, async () => {
      await startApp()
      expect(mockInitialiseContainers).toHaveBeenCalledTimes(expectedInit)
    })

    test(`starts processing ${expectedInit ? 'once' : 'not at all'}`, async () => {
      await startApp()
      expect(mockProcessingStart).toHaveBeenCalledTimes(expectedInit)
    })

    test(`starts messaging ${expectedInit ? 'once' : 'not at all'}`, async () => {
      await startApp()
      expect(mockMessagingStart).toHaveBeenCalledTimes(expectedInit)
    })

    test(`console.info logging ${expectedInit ? 'disabled' : 'enabled'}`, async () => {
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
      await startApp()
      if (active) {
        expect(consoleInfoSpy).not.toHaveBeenCalled()
      } else {
        expect(consoleInfoSpy).toHaveBeenCalledWith(
          expect.stringContaining('Processing capabilities are currently not enabled in this environment')
        )
      }
      consoleInfoSpy.mockRestore()
    })
  })
})
