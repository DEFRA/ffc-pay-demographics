const { POST } = require('../../constants/methods')
const { processDemographicsMessage } = require('../../processing/process-demographics-message')

module.exports = [{
  method: POST,
  path: '/fcp-event',
  options: {
    handler: async (request, h) => {
      try {
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
