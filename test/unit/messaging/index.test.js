const mockSubscribe = jest.fn()
const mockCloseConnection = jest.fn()

const MockMessageReceiver = jest.fn().mockImplementation(() => ({
  subscribe: mockSubscribe,
  closeConnection: mockCloseConnection
}))

jest.mock('ffc-messaging', () => ({ MessageReceiver: MockMessageReceiver }))
jest.mock('../../../app/messaging/process-demographics-message', () => jest.fn())

const { messagingConfig, processingConfig } = require('../../../app/config')
const { start, stop } = require('../../../app/messaging')

describe('messaging module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    processingConfig.enabled = true
  })

  describe('start()', () => {
    test('creates message receiver and subscribes if enabled', async () => {
      await start()
      expect(MockMessageReceiver).toHaveBeenCalledWith(messagingConfig.updatesSubscription, expect.any(Function))
      expect(mockSubscribe).toHaveBeenCalled()
    })

    test('does not start receiver if disabled', async () => {
      processingConfig.enabled = false
      await start()
      expect(MockMessageReceiver).not.toHaveBeenCalled()
      expect(mockSubscribe).not.toHaveBeenCalled()
    })
  })

  describe('stop()', () => {
    test('closes connection', async () => {
      await start()
      await stop()
      expect(mockCloseConnection).toHaveBeenCalled()
    })
  })
})
