jest.mock('../../../app/storage')
const { downloadFile: mockDownloadFile, archiveFile: mockArchiveFile, quarantineFile: mockQuarantineFile } = require('../../../app/storage')

jest.mock('../../../app/processing/parse-acknowledgement-file')
const { parseAcknowledgementFile: mockParseAcknowledgementFile } = require('../../../app/processing/parse-acknowledgement-file')

jest.mock('../../../app/event')
const { sendDemographicsFailureEvent: mockSendDemographicsFailureEvent } = require('../../../app/event')

const content = require('../../mocks/return-file-content')
const parsedContent = require('../../mocks/parsed-acknowledgement-content')

const { processReturnFile } = require('../../../app/processing/process-return-file')

const filename = require('../../mocks/return-filename')
const { DAX } = require('../../../app/constants/containers')
const { DEMOGRAPHICS_UPDATE_FAILED } = require('../../../app/constants/events')

const err = new Error('These are not the droids you\'re looking for')

let output
describe('process return file', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => { })
    output = { ...parsedContent }
    mockDownloadFile.mockResolvedValue(content)
    mockParseAcknowledgementFile.mockReturnValue(output)
    mockSendDemographicsFailureEvent.mockReturnValue(true)
    mockArchiveFile.mockResolvedValue(true)
    mockQuarantineFile.mockResolvedValue(true)
  })

  test('should download file from file storage', async () => {
    await processReturnFile(filename)
    expect(mockDownloadFile).toHaveBeenCalledWith(filename, DAX)
  })

  test('if download fails, should throw error', async () => {
    mockDownloadFile.mockRejectedValue(err)
    await processReturnFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('if download fails, should quarantine file', async () => {
    mockDownloadFile.mockRejectedValue(err)
    await processReturnFile(filename)
    expect(mockQuarantineFile).toHaveBeenCalled()
  })

  test('should parse acknowledgement file', async () => {
    await processReturnFile(filename)
    expect(mockParseAcknowledgementFile).toHaveBeenCalledWith(content)
  })

  test('if parse acknowledgement file fails, should throw error', async () => {
    mockParseAcknowledgementFile.mockRejectedValue(err)
    await processReturnFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('if parse acknowledgement file fails, should quarantine file', async () => {
    mockParseAcknowledgementFile.mockRejectedValue(err)
    await processReturnFile(filename)
    expect(mockQuarantineFile).toHaveBeenCalled()
  })

  test('should send demographics failure event if failedFRNs has length >= 1', async () => {
    await processReturnFile(filename)
    expect(mockSendDemographicsFailureEvent).toHaveBeenCalledWith(filename, DEMOGRAPHICS_UPDATE_FAILED, 'Demographics updates for the following FRNs have failed to be processed by DAX: 9876543210')
  })

  test('should not send demographics failure event if failedFRNs has length 0', async () => {
    output.failedFRNs = []
    await processReturnFile(filename)
    expect(mockSendDemographicsFailureEvent).not.toHaveBeenCalled()
  })

  test('if send demographics failure event fails, should throw error', async () => {
    mockSendDemographicsFailureEvent.mockRejectedValue(err)
    await processReturnFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('if send demographics failure event fails, should quarantine file', async () => {
    mockSendDemographicsFailureEvent.mockRejectedValue(err)
    await processReturnFile(filename)
    expect(mockQuarantineFile).toHaveBeenCalled()
  })

  test('should archive file', async () => {
    await processReturnFile(filename)
    expect(mockArchiveFile).toHaveBeenCalledWith(filename)
  })

  test('if archive file fails, should throw error', async () => {
    mockArchiveFile.mockRejectedValue(err)
    await processReturnFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('if archive file fails, should quarantine file', async () => {
    mockArchiveFile.mockRejectedValue(err)
    await processReturnFile(filename)
    expect(mockQuarantineFile).toHaveBeenCalled()
  })
})
