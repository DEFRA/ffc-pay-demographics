const mockSender = {}
const mockGetSender = jest.fn().mockReturnValue(mockSender)
const mockSendMessage = jest.fn()

jest.mock('../../../app/messaging/service-bus', () => ({
  getSender: mockGetSender,
  sendMessage: mockSendMessage
}))

const { messagingConfig } = require('../../../app/config')

jest.mock('../../../app/messaging/create-message')
const { createMessage } = require('../../../app/messaging/create-message')
const { sendExtractMessage } = require('../../../app/messaging/send-extract-message')
const { EXTRACT } = require('../../../app/constants/message-types')

describe('sendExtractMessage', () => {
  const body = { key: 'value' }
  const mockMessage = { message: 'mockMessage' }
  const mockTopic = 'mockTopic'

  beforeEach(() => {
    jest.clearAllMocks()
    createMessage.mockReturnValue(mockMessage)
    messagingConfig.extractTopic = mockTopic
  })

  test('creates a message with the correct type', async () => {
    await sendExtractMessage(body)
    expect(createMessage).toHaveBeenCalledWith(body, EXTRACT)
  })

  test('gets sender with the correct topic', async () => {
    await sendExtractMessage(body)
    expect(mockGetSender).toHaveBeenCalledWith(mockTopic)
  })

  test('sends the message', async () => {
    await sendExtractMessage(body)
    expect(mockSendMessage).toHaveBeenCalledWith(mockSender, mockMessage)
  })

  test('throws an error if sendMessage fails', async () => {
    mockSendMessage.mockRejectedValue(new Error('sendMessage failed'))
    await expect(sendExtractMessage(body)).rejects.toThrow('sendMessage failed')
  })
})
