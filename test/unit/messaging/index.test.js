const mockSubscribe = jest.fn()
const mockCloseConnection = jest.fn()
const mockProcessDemographicsMessage = jest.fn()

const MockMessageReceiver = jest.fn().mockImplementation((subscription, action) => {
  return {
    subscribe: mockSubscribe,
    closeConnection: mockCloseConnection
  }
})

jest.mock('ffc-messaging', () => {
  return {
    MessageReceiver: MockMessageReceiver
  }
})

jest.mock('../../../app/messaging/process-demographics-message', () => mockProcessDemographicsMessage)

const { messagingConfig, processingConfig } = require('../../../app/config')
const { start, stop } = require('../../../app/messaging')

beforeEach(() => {
  jest.clearAllMocks()

  processingConfig.enabled = true
})

describe('messaging start', () => {
  test('creates new message receiver with correct subscription', async () => {
    await start()
    expect(MockMessageReceiver).toHaveBeenCalledTimes(1)
    expect(MockMessageReceiver).toHaveBeenCalledWith(messagingConfig.updatesSubscription, expect.any(Function))
  })

  test('subscribes to message receiver', async () => {
    await start()
    expect(mockSubscribe).toHaveBeenCalledTimes(1)
  })

  test('does not start receiver if processingConfig is disabled', async () => {
    processingConfig.enabled = false
    await start()
    expect(MockMessageReceiver).not.toHaveBeenCalled()
    expect(mockSubscribe).not.toHaveBeenCalled()
  })
})

describe('messaging stop', () => {
  test('closes connection', async () => {
    await start()
    await stop()
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  })
})
