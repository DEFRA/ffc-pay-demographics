const mockSender = {}
const mockGetSender = jest.fn().mockReturnValue(mockSender)
const mockSendMessage = jest.fn()

jest.mock('../../../app/messaging/service-bus', () => ({
  getSender: mockGetSender,
  sendMessage: mockSendMessage
}))
jest.mock('../../../app/messaging/create-message')
const { createMessage: mockCreateMessage } = require('../../../app/messaging/create-message')

const { messagingConfig } = require('../../../app/config')
const { sendMessages } = require('../../../app/messaging/send-messages')
const frn = require('../../mocks/frn')
const sbi = require('../../mocks/sbi')
const { CUSTOMER } = require('../../../app/constants/message-types')

describe('sendMessages', () => {
  let messages

  beforeEach(() => {
    jest.clearAllMocks()
    messages = [{ frn, sbi }]
    mockCreateMessage.mockReturnValue(messages[0])
  })

  test('creates message from input and type', async () => {
    await sendMessages(messages, CUSTOMER)
    expect(mockCreateMessage).toHaveBeenCalledWith(messages[0], CUSTOMER)
  })

  test('gets sender with the correct topic', async () => {
    await sendMessages(messages, CUSTOMER)
    expect(mockGetSender).toHaveBeenCalledWith(messagingConfig.customerTopic)
  })

  test('sends created message', async () => {
    await sendMessages(messages, CUSTOMER)
    expect(mockSendMessage).toHaveBeenCalledWith(mockSender, messages[0])
  })
})
