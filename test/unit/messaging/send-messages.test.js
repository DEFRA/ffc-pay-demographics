const mockSendMessage = jest.fn()
const mockCloseConnection = jest.fn()
const MockMessageSender = jest.fn().mockImplementation(() => ({
  sendMessage: mockSendMessage,
  closeConnection: mockCloseConnection
}))

jest.mock('ffc-messaging', () => ({ MessageSender: MockMessageSender }))
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

  test('instantiates MessageSender with the correct topic', async () => {
    await sendMessages(messages, CUSTOMER)
    expect(MockMessageSender).toHaveBeenCalledWith(messagingConfig.customerTopic)
  })

  test('sends created message and closes connection', async () => {
    await sendMessages(messages, CUSTOMER)
    expect(mockSendMessage).toHaveBeenCalledWith(messages[0])
    expect(mockCloseConnection).toHaveBeenCalled()
  })
})
