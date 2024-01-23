const mockPublishEvent = jest.fn()

const MockEventPublisher = jest.fn().mockImplementation(() => {
  return {
    publishEvent: mockPublishEvent
  }
})

jest.mock('ffc-pay-event-publisher', () => {
  return {
    EventPublisher: MockEventPublisher
  }
})

jest.mock('../../../app/config/processing')
const processingConfig = require('../../../app/config/processing')

jest.mock('../../../app/config/messaging')
const messagingConfig = require('../../../app/config/messaging')

const { DEMOGRAPHICS_UPDATE_FAILED, DEMOGRAPHICS_PROCESSING_FAILED } = require('../../../app/constants/events')

const sendDemographicsFailureEvent = require('../../../app/event/send-demographics-failure-event')

const filename = 'Claimant Update 2024-01-16 040605Ack.xml'
const error = {
  message: 'Demographics updates for the following FRNs have failed to be processed by DAX: 9876543210'
}

describe('send demographics failure event', () => {
  beforeEach(async () => {
    processingConfig.useEvents = true
    messagingConfig.eventsTopic = 'events'
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('send events when events enabled ', async () => {
    processingConfig.useEvents = true
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should not send events when events disabled', async () => {
    processingConfig.useEvents = false
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should send event to events topic', async () => {
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(messagingConfig.eventsTopic)
  })

  test('should raise an event with demographics source', async () => {
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe('ffc-pay-demographics')
  })

  test('should raise an event with DEMOGRAPHICS_PROCESSING_FAILED event type', async () => {
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_PROCESSING_FAILED, error)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(DEMOGRAPHICS_PROCESSING_FAILED)
  })

  test('should raise an event with DEMOGRAPHICS_UPDATE_FAILED event type', async () => {
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(DEMOGRAPHICS_UPDATE_FAILED)
  })

  test('should raise an event with filename as subject', async () => {
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    expect(mockPublishEvent.mock.calls[0][0].subject).toBe(filename)
  })

  test('should include error message in the event data', async () => {
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    expect(mockPublishEvent.mock.calls[0][0].data.message).toBe(error)
  })

  test('should include filename in the event data', async () => {
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    expect(mockPublishEvent.mock.calls[0][0].data.filename).toBe(filename)
  })
})
