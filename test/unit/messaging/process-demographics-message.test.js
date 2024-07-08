const getFileNameFromUrl = require('../../../app/messaging/get-file-name-from-url')
const processDemographicsMessage = require('../../../app/messaging/process-demographics-message')
const processFile = require('../../../app/processing/process-file')

jest.mock('../../../app/messaging/get-file-name-from-url')
jest.mock('../../../app/processing/process-file')

describe('process demographics message', () => {
  let message
  let receiver

  beforeEach(() => {
    message = {
      body: [
        {
          data: {
            url: 'http://example.com/path/to/file.txt'
          }
        }
      ]
    }
    receiver = {
      completeMessage: jest.fn()
    }

    getFileNameFromUrl.mockReturnValue('file.txt')
    processFile.mockResolvedValue()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should extract the file name from the URL and process the file', async () => {
    await processDemographicsMessage(message, receiver)

    expect(getFileNameFromUrl).toHaveBeenCalledWith('http://example.com/path/to/file.txt')
    expect(processFile).toHaveBeenCalledWith('file.txt')
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should handle errors and not complete the message if processing fails', async () => {
    const error = new Error('Processing failed')
    processFile.mockRejectedValue(error)

    await processDemographicsMessage(message, receiver)

    expect(getFileNameFromUrl).toHaveBeenCalledWith('http://example.com/path/to/file.txt')
    expect(processFile).toHaveBeenCalledWith('file.txt')
    expect(receiver.completeMessage).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('Unable to process demographics message:', error)
  })

  test('should handle missing URL in message body', async () => {
    message.body[0].data.url = null

    await processDemographicsMessage(message, receiver)

    expect(getFileNameFromUrl).toHaveBeenCalledWith(null)
    expect(processFile).toHaveBeenCalledWith('')
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })
})
