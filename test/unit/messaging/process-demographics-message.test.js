jest.mock('ffc-messaging')
jest.mock('../../../app/data')
jest.mock('../../../app/processing/process-file')
const processFile = require('../../../app/processing/process-file')
jest.mock('../../../app/messaging/get-file-name-from-url')
const getFileNameFromUrl = require('../../../app/messaging/get-file-name-from-url')
const processDemographicsMessage = require('../../../app/messaging/process-demographics-message')
let receiver
const message = {
  body: [{
    data: {
      url: 'https://url/to/file.txt'
    }
  }]
}

describe('process demographics message', () => {
  beforeEach(() => {
    receiver = {
      completeMessage: jest.fn()
    }
    processFile.mockResolvedValue(true)
    getFileNameFromUrl.mockResolvedValue('file.txt')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('calls getFileNameFromUrl', async () => {
    await processDemographicsMessage(message, receiver)
    expect(getFileNameFromUrl).toHaveBeenCalledWith('https://url/to/file.txt')
  })

  test('completes valid message', async () => {
    await processDemographicsMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })
})
