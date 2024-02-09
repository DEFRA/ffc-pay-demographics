const mockSendMessage = jest.fn()
const mockCloseConnection = jest.fn()
const MockMessageSender = jest.fn().mockImplementation(() => {
  return {
    sendMessage: mockSendMessage,
    closeConnection: mockCloseConnection
  }
})

jest.mock('ffc-messaging', () => {
  return {
    MessageSender: MockMessageSender
  }
})

jest.mock('../../../app/messaging/create-message')
const { createMessage: mockCreateMessage } = require('../../../app/messaging/create-message')

const { messagingConfig } = require('../../../app/config')

const { sendMessages } = require('../../../app/messaging/send-messages')
const frn = require('../../mocks/frn')
const sbi = require('../../mocks/sbi')
const { CUSTOMER } = require('../../../app/constants/message-types')
let messages

describe('send message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    messages = [{ frn, sbi }]
    mockCreateMessage.mockReturnValue({ frn, sbi })
  })

  test('should create message from message and type', async () => {
    await sendMessages(messages, CUSTOMER)
    expect(mockCreateMessage).toHaveBeenCalledWith(messages[0], CUSTOMER)
  })

  test('should create new message sender', async () => {
    await sendMessages(messages, CUSTOMER)
    expect(MockMessageSender).toHaveBeenCalledWith(messagingConfig.customerTopic)
  })

  test('should send created message', async () => {
    await sendMessages(messages, CUSTOMER)
    expect(mockSendMessage).toHaveBeenCalledWith(messages[0])
  })

  test('should close connection after sending', async () => {
    await sendMessages(messages, CUSTOMER)
    expect(mockCloseConnection).toHaveBeenCalled()
  })
})
