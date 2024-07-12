jest.mock('ffc-messaging')
const { MessageSender } = require('ffc-messaging')
const { messagingConfig } = require('../../../app/config')

jest.mock('../../../app/messaging/create-message')
const { createMessage } = require('../../../app/messaging/create-message')
const { sendExtractMessage } = require('../../../app/messaging/send-extract-message')
const { EXTRACT } = require('../../../app/constants/message-types')

describe('send demographics extract to service bus', () => {
  const body = { key: 'value' }
  const mockMessage = { message: 'mockMessage' }
  const mockTopic = 'mockTopic'

  beforeEach(() => {
    jest.clearAllMocks()
    createMessage.mockReturnValue(mockMessage)
    messagingConfig.extractTopic = mockTopic
  })

  test('should create a message with the correct type', async () => {
    await sendExtractMessage(body)
    expect(createMessage).toHaveBeenCalledWith(body, EXTRACT)
  })

  test('should instantiate MessageSender with the correct topic', async () => {
    await sendExtractMessage(body)
    expect(MessageSender).toHaveBeenCalledWith(mockTopic)
  })

  test('should send the message using MessageSender', async () => {
    const mockSendMessage = jest.fn()
    const mockCloseConnection = jest.fn()
    MessageSender.mockImplementation(() => ({
      sendMessage: mockSendMessage,
      closeConnection: mockCloseConnection
    }))
    await sendExtractMessage(body)
    expect(mockSendMessage).toHaveBeenCalledWith(mockMessage)
  })

  test('should close the MessageSender connection after sending the message', async () => {
    const mockSendMessage = jest.fn()
    const mockCloseConnection = jest.fn()
    MessageSender.mockImplementation(() => ({
      sendMessage: mockSendMessage,
      closeConnection: mockCloseConnection
    }))
    await sendExtractMessage(body)
    expect(mockCloseConnection).toHaveBeenCalled()
  })

  test('should throw an error if sendMessage fails', async () => {
    const mockSendMessage = jest.fn().mockRejectedValue(new Error('sendMessage failed'))
    const mockCloseConnection = jest.fn()
    MessageSender.mockImplementation(() => ({
      sendMessage: mockSendMessage,
      closeConnection: mockCloseConnection
    }))
    await expect(sendExtractMessage(body)).rejects.toThrow('sendMessage failed')
  })

  test('should throw an error if closeConnection fails', async () => {
    const mockSendMessage = jest.fn()
    const mockCloseConnection = jest.fn().mockRejectedValue(new Error('closeConnection failed'))
    MessageSender.mockImplementation(() => ({
      sendMessage: mockSendMessage,
      closeConnection: mockCloseConnection
    }))
    await expect(sendExtractMessage(body)).rejects.toThrow('closeConnection failed')
  })
})
