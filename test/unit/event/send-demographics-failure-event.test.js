const mockPublishEvent = jest.fn()

const MockEventPublisher = jest.fn().mockImplementation(() => ({
  publishEvent: mockPublishEvent
}))

jest.mock('ffc-pay-event-publisher', () => ({ EventPublisher: MockEventPublisher }))
jest.mock('../../../app/config/processing')
jest.mock('../../../app/config/messaging')

const processingConfig = require('../../../app/config/processing')
const messagingConfig = require('../../../app/config/messaging')

const { DEMOGRAPHICS_UPDATE_FAILED, DEMOGRAPHICS_PROCESSING_FAILED } = require('../../../app/constants/events')
const sendDemographicsFailureEvent = require('../../../app/event/send-demographics-failure-event')

const filename = 'Claimant Update 2024-01-16 040605Ack.xml'
const error = { message: 'Demographics updates for the following FRNs have failed to be processed by DAX: 9876543210' }

describe('send demographics failure event', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    processingConfig.useEvents = true
    messagingConfig.eventsTopic = 'events'
  })

  test('sends events when enabled and does not when disabled', async () => {
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    expect(mockPublishEvent).toHaveBeenCalled()

    processingConfig.useEvents = false
    mockPublishEvent.mockClear()

    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('sends event to the correct topic', async () => {
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(messagingConfig.eventsTopic)
  })

  test('event includes correct source, subject, filename, and message', async () => {
    await sendDemographicsFailureEvent(filename, DEMOGRAPHICS_UPDATE_FAILED, error)
    const evt = mockPublishEvent.mock.calls[0][0]

    expect(evt.source).toBe('ffc-pay-demographics')
    expect(evt.subject).toBe(filename)
    expect(evt.data.filename).toBe(filename)
    expect(evt.data.message).toBe(error)
  })

  test.each([
    [DEMOGRAPHICS_UPDATE_FAILED],
    [DEMOGRAPHICS_PROCESSING_FAILED]
  ])('event type is %s', async (eventType) => {
    await sendDemographicsFailureEvent(filename, eventType, error)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(eventType)
  })
})
