const { POST } = require('../../constants/methods')
const { processDemographicsMessage } = require('../../processing/process-demographics-message')

module.exports = [{
  method: POST,
  path: '/demographics',
  options: {
    handler: async (request, h) => {
      try {
        const header = request.get('Aeg-Event-Type')
        if (header && header === 'SubscriptionValidation') {
          const event = request.body[0]
          const isValidationEvent = event && event.data &&
                                    event.data.validationCode &&
                                    event.eventType && event.eventType === 'Microsoft.EventGrid.SubscriptionValidationEvent'
          if (isValidationEvent) {
            return h.send({
              validationResponse: event.data.validationCode
            })
          }
        }
        console.log('Received demographics event:', request.payload)
        await processDemographicsMessage(request.payload)
        return h.response().code(200)
      } catch (error) {
        console.error('Error processing demographics event:', error)
        return h.response().code(500)
      }
    }
  }
}]
