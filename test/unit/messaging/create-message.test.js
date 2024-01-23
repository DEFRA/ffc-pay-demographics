const { SOURCE } = require('../../../app/constants/source')
const { DEMOGRAPHICS } = require('../../../app/constants/message-types')

const { createMessage } = require('../../../app/messaging/create-message')

describe('create message', () => {
  test('sets update as body', () => {
    const update = {}
    const message = createMessage(update)
    expect(message.body).toEqual(update)
  })

  test('sets type', () => {
    const update = {}
    const message = createMessage(update, DEMOGRAPHICS)
    expect(message.type).toEqual(DEMOGRAPHICS)
  })

  test('sets source', () => {
    const update = {}
    const message = createMessage(update)
    expect(message.source).toEqual(SOURCE)
  })
})
