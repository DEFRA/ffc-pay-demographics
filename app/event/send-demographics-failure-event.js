const config = require('../config/processing')
const messageConfig = require('../config/messaging')
const { EventPublisher } = require('ffc-pay-event-publisher')

const sendDemographicsFailureEvent = async (filename, type, error) => {
  if (config.useEvents) {
    const event = {
      source: 'ffc-pay-demographics',
      type,
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
