const getFileNameFromUrl = require('../../../app/messaging/get-file-name-from-url')
const processDemographicsMessage = require('../../../app/messaging/process-demographics-message')
const processFile = require('../../../app/processing/process-file')

jest.mock('../../../app/messaging/get-file-name-from-url')
jest.mock('../../../app/processing/process-file')

describe('processDemographicsMessage', () => {
  let message, receiver, consoleErrorSpy

  beforeEach(() => {
    message = { body: { data: { url: 'http://example.com/path/to/file.txt' } } }
    receiver = { completeMessage: jest.fn(), deadLetterMessage: jest.fn() }

    getFileNameFromUrl.mockReturnValue('file.txt')
    processFile.mockResolvedValue()

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy.mockRestore()
  })

  test('extracts file name and processes the file', async () => {
    await processDemographicsMessage(message, receiver)

    expect(getFileNameFromUrl).toHaveBeenCalledWith('http://example.com/path/to/file.txt')
    expect(processFile).toHaveBeenCalledWith('file.txt')
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('handles processing errors and logs them without completing the message', async () => {
    const error = new Error('Processing failed')
    processFile.mockRejectedValue(error)

    await processDemographicsMessage(message, receiver)

    expect(receiver.completeMessage).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('Unable to process demographics message:', error)
  })

  test('handles missing URL in message body', async () => {
    message.body.data.url = null
    getFileNameFromUrl.mockReturnValue('')

    await processDemographicsMessage(message, receiver)

    expect(getFileNameFromUrl).toHaveBeenCalledWith(null)
    expect(processFile).toHaveBeenCalledWith('')
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })
})
