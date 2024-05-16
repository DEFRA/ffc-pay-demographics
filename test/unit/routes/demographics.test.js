const { POST } = require('../../../app/constants/methods')
const { processDemographicsMessage } = require('../../../app/processing/process-demographics-message')
const demographicsRoute = require('../../../app/server/routes/demographics')[0]

jest.mock('../../../app/processing/process-demographics-message', () => ({
  processDemographicsMessage: jest.fn()
}))

describe('/demographics route', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should handle SubscriptionValidation event', async () => {
    const request = {
      method: POST,
      payload: [{
        eventType: 'Microsoft.EventGrid.SubscriptionValidationEvent',
        data: { validationCode: '123' }
      }]
    }
    const response = await demographicsRoute.options.handler(request, { response: (body) => ({ code: (statusCode) => ({ body, statusCode }) }) })
    expect(response.body.ValidationResponse).toEqual('123')
  })

  test('should process demographics event', async () => {
    const request = {
      method: POST,
      payload: [{ eventType: 'demographicsEvent', data: {} }]
    }
    await demographicsRoute.options.handler(request, { response: () => ({ code: (statusCode) => ({ statusCode }) }) })
    expect(processDemographicsMessage).toHaveBeenCalled()
  })

  test('should handle error', async () => {
    const request = {
      method: POST,
      payload: [{ eventType: 'demographicsEvent', data: {} }]
    }
    processDemographicsMessage.mockImplementationOnce(() => { throw new Error('Test error') })
    const response = await demographicsRoute.options.handler(request, { response: () => ({ code: (statusCode) => ({ statusCode }) }) })
    expect(response.statusCode).toEqual(500)
  })
})
