const config = require('../config/processing')
const messageConfig = require('../config/messaging')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { DEMOGRAPHICS_UPDATE_FAILED } = require('../constants/events')

const sendDemographicsFailureEvent = async (filename, error) => {
  if (config.useEvents) {
    const event = {
      source: 'ffc-pay-demographics',
      type: DEMOGRAPHICS_UPDATE_FAILED,
      subject: filename,
      data: {
        message: error,
        filename
      }
    }
    const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
    await eventPublisher.publishEvent(event)
  }
}

module.exports = sendDemographicsFailureEvent
