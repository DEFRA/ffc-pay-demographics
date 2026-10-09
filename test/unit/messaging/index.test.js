const mockReceiver = {
  subscribe: jest.fn(),
  close: jest.fn()
}
const mockClient = {
  close: jest.fn()
}
const mockCreateServiceBusClient = jest.fn().mockReturnValue(mockClient)
const mockCreateReceiver = jest.fn().mockReturnValue(mockReceiver)
const mockSubscribeReceiver = jest.fn()
const mockCloseSenders = jest.fn()

jest.mock('../../../app/messaging/service-bus', () => ({
  createServiceBusClient: mockCreateServiceBusClient,
  createReceiver: mockCreateReceiver,
  subscribeReceiver: mockSubscribeReceiver,
  closeSenders: mockCloseSenders
}))
jest.mock('../../../app/messaging/process-demographics-message', () => jest.fn())

const { messagingConfig, processingConfig } = require('../../../app/config')
const { start, stop } = require('../../../app/messaging')

describe('messaging module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    processingConfig.enabled = true
  })

  describe('start()', () => {
    test('creates service bus client, receiver and subscribes if enabled', async () => {
      await start()
      expect(mockCreateServiceBusClient).toHaveBeenCalledWith(messagingConfig.updatesSubscription)
      expect(mockCreateReceiver).toHaveBeenCalledWith(mockClient, messagingConfig.updatesSubscription)
      expect(mockSubscribeReceiver).toHaveBeenCalledWith(mockReceiver, expect.any(Function), console.error, messagingConfig.updatesSubscription)
    })

    test('does not start receiver if disabled', async () => {
      processingConfig.enabled = false
      await start()
      expect(mockCreateServiceBusClient).not.toHaveBeenCalled()
      expect(mockCreateReceiver).not.toHaveBeenCalled()
      expect(mockSubscribeReceiver).not.toHaveBeenCalled()
    })
  })

  describe('stop()', () => {
    test('closes connection', async () => {
      await start()
      await stop()
      expect(mockReceiver.close).toHaveBeenCalled()
      expect(mockClient.close).toHaveBeenCalled()
      expect(mockCloseSenders).toHaveBeenCalled()
    })
  })
})
