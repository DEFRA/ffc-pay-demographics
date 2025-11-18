jest.mock('ffc-messaging')
const { MessageSender } = require('ffc-messaging')
const { messagingConfig } = require('../../../app/config')

jest.mock('../../../app/messaging/create-message')
const { createMessage } = require('../../../app/messaging/create-message')
const { sendExtractMessage } = require('../../../app/messaging/send-extract-message')
const { EXTRACT } = require('../../../app/constants/message-types')

describe('sendExtractMessage', () => {
  const body = { key: 'value' }
  const mockMessage = { message: 'mockMessage' }
  const mockTopic = 'mockTopic'

  let mockSendMessage, mockCloseConnection

  beforeEach(() => {
    jest.clearAllMocks()
    createMessage.mockReturnValue(mockMessage)
    messagingConfig.extractTopic = mockTopic

    mockSendMessage = jest.fn()
    mockCloseConnection = jest.fn()
    MessageSender.mockImplementation(() => ({
      sendMessage: mockSendMessage,
      closeConnection: mockCloseConnection
    }))
  })

  test('creates a message with the correct type', async () => {
    await sendExtractMessage(body)
    expect(createMessage).toHaveBeenCalledWith(body, EXTRACT)
  })

  test('instantiates MessageSender with the correct topic', async () => {
    await sendExtractMessage(body)
    expect(MessageSender).toHaveBeenCalledWith(mockTopic)
  })

  test('sends the message and closes the connection', async () => {
    await sendExtractMessage(body)
    expect(mockSendMessage).toHaveBeenCalledWith(mockMessage)
    expect(mockCloseConnection).toHaveBeenCalled()
  })

  test.each([
    ['sendMessage', () => { mockSendMessage.mockRejectedValue(new Error('sendMessage failed')) }, 'sendMessage failed'],
    ['closeConnection', () => { mockCloseConnection.mockRejectedValue(new Error('closeConnection failed')) }, 'closeConnection failed']
  ])('throws an error if %s fails', async (_, setup, expectedError) => {
    setup()
    await expect(sendExtractMessage(body)).rejects.toThrow(expectedError)
  })
})
