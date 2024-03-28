jest.mock('../../../../app/processing/process-demographics-message')
const { processDemographicsMessage: mockProcessDemographicsMessage } = require('../../../../app/processing/process-demographics-message')

const { POST } = require('../../../../app/constants/methods')

let server

describe('fcp event', () => {
  beforeEach(async () => {
    jest.clearAllMocks()

    const { createServer } = require('../../../../app/server/create-server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('POST /fcp-event calls processDemographicsMessage', async () => {
    const options = {
      method: POST,
      url: '/fcp-event',
      payload: {
        string: 'Payload'
      }
    }

    await server.inject(options)
    expect(mockProcessDemographicsMessage).toHaveBeenCalledWith({
      string: 'Payload'
    })
  })

  test('POST /fcp-event returns 200 if successful', async () => {
    const options = {
      method: POST,
      url: '/fcp-event',
      payload: {
        string: 'Payload'
      }
    }
    mockProcessDemographicsMessage.mockResolvedValue(true)
    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('POST /fcp-event returns 500 if processing fails', async () => {
    const options = {
      method: POST,
      url: '/fcp-event',
      payload: {
        string: 'Payload'
      }
    }

    mockProcessDemographicsMessage.mockRejectedValue(new Error())

    const result = await server.inject(options)
    expect(result.statusCode).toBe(500)
  })
})
