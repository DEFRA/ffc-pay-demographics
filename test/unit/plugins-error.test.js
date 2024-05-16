const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')
const errorPlugin = require('../../app/server/plugins/errors')

describe('error plugin', () => {
  let server

  beforeEach(async () => {
    server = Hapi.server()
    await server.register(errorPlugin)
  })

  afterEach(async () => {
    await server.stop()
  })

  test('should return error when response is Boom', async () => {
    server.route({
      method: 'GET',
      path: '/',
      handler: () => Boom.badRequest('Test error', { payload: { message: 'Payload message' } })
    })

    const request = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(request)

    expect(response.statusCode).toBe(400)
    expect(response.statusMessage).toBe('Bad Request')
    expect(JSON.parse(response.payload).message).toBe('Test error')
  })

  test('should return success when response is not Boom', async () => {
    server.route({
      method: 'GET',
      path: '/',
      handler: () => 'ok'
    })

    const request = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(request)

    expect(response.statusCode).toBe(200)
    expect(response.statusMessage).toBe('OK')
    expect(response.payload).toBe('ok')
  })
})
