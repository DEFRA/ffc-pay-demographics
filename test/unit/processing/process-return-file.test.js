jest.mock('../../../app/storage')
jest.mock('../../../app/processing/parse-acknowledgement-file')
jest.mock('../../../app/event')

const {
  downloadFile: mockDownloadFile,
  archiveFile: mockArchiveFile,
  quarantineFile: mockQuarantineFile
} = require('../../../app/storage')

const { parseAcknowledgementFile: mockParseAcknowledgementFile } = require('../../../app/processing/parse-acknowledgement-file')
const { sendDemographicsFailureEvent: mockSendDemographicsFailureEvent } = require('../../../app/event')

const { processReturnFile } = require('../../../app/processing/process-return-file')
const content = require('../../mocks/return-file-content')
const parsedContent = require('../../mocks/parsed-acknowledgement-content')
const filename = require('../../mocks/return-filename')

const { DAX } = require('../../../app/constants/containers')
const { DEMOGRAPHICS_UPDATE_FAILED } = require('../../../app/constants/events')

const err = new Error('These are not the droids you\'re looking for')

describe('processReturnFile', () => {
  let output

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})

    output = { ...parsedContent }
    mockDownloadFile.mockResolvedValue(content)
    mockParseAcknowledgementFile.mockReturnValue(output)
    mockSendDemographicsFailureEvent.mockResolvedValue(true)
    mockArchiveFile.mockResolvedValue(true)
    mockQuarantineFile.mockResolvedValue(true)
  })

  test('downloads file from file storage', async () => {
    await processReturnFile(filename)
    expect(mockDownloadFile).toHaveBeenCalledWith(filename, DAX)
  })

  test('parses acknowledgement file', async () => {
    await processReturnFile(filename)
    expect(mockParseAcknowledgementFile).toHaveBeenCalledWith(content)
  })

  test('archives file', async () => {
    await processReturnFile(filename)
    expect(mockArchiveFile).toHaveBeenCalledWith(filename)
  })

  test('sends demographics failure event if failedFRNs exists', async () => {
    await processReturnFile(filename)
    expect(mockSendDemographicsFailureEvent).toHaveBeenCalledWith(
      filename,
      DEMOGRAPHICS_UPDATE_FAILED,
      'Demographics updates for the following FRNs have failed to be processed by DAX: 9876543210'
    )
  })

  test('does not send demographics failure event if no failedFRNs', async () => {
    output.failedFRNs = []
    await processReturnFile(filename)
    expect(mockSendDemographicsFailureEvent).not.toHaveBeenCalled()
  })

  describe('error handling', () => {
    const errorCases = [
      { mockFn: 'mockDownloadFile', expectedCall: mockDownloadFile },
      { mockFn: 'mockParseAcknowledgementFile', expectedCall: mockParseAcknowledgementFile },
      { mockFn: 'mockSendDemographicsFailureEvent', expectedCall: mockSendDemographicsFailureEvent },
      { mockFn: 'mockArchiveFile', expectedCall: mockArchiveFile }
    ]

    errorCases.forEach(({ mockFn }) => {
      test(`should log error and quarantine file if ${mockFn} fails`, async () => {
        const mocks = {
          mockDownloadFile,
          mockParseAcknowledgementFile,
          mockSendDemographicsFailureEvent,
          mockArchiveFile
        }
        mocks[mockFn].mockRejectedValue(err)
        await processReturnFile(filename)
        expect(console.error).toHaveBeenCalledWith(err)
        expect(mockQuarantineFile).toHaveBeenCalled()
      })
    })
  })
})
