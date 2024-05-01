jest.mock('ffc-messaging')
jest.mock('../../../app/data')
jest.mock('../../../app/processing/process-file')
const processFile = require('../../../app/processing/process-file')
jest.mock('../../../app/processing/get-file-name-from-url')
const { getFileNameFromUrl } = require('../../../app/processing/get-file-name-from-url')
const { processDemographicsMessage } = require('../../../app/processing/process-demographics-message')

const message = {
  body: {
    data: {
      url: 'https://url/to/file.txt'
    }
  }
}

describe('process demographics message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls getFileNameFromUrl', async () => {
    await processDemographicsMessage(message.body)
    expect(getFileNameFromUrl).toHaveBeenCalledWith('https://url/to/file.txt')
  })

  test('calls processFile', async () => {
    getFileNameFromUrl.mockReturnValue('file.txt')
    await processDemographicsMessage(message.body)
    expect(processFile).toHaveBeenCalledWith('file.txt')
  })
})
