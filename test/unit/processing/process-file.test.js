jest.mock('../../../app/storage')
jest.mock('../../../app/processing/create-customer-update')
jest.mock('../../../app/processing/create-dax-data')
jest.mock('../../../app/processing/create-dax-update')
jest.mock('../../../app/messaging/send-messages')
jest.mock('../../../app/event')
jest.mock('../../../app/processing/get-outbound-file-name')
jest.mock('../../../app/messaging/send-extract-message')

const {
  downloadFile: mockDownloadFile,
  uploadFile: mockUploadFile
} = require('../../../app/storage')
const { createCustomerUpdate: mockCreateCustomerUpdate } = require('../../../app/processing/create-customer-update')
const { createDaxData: mockCreateDaxData } = require('../../../app/processing/create-dax-data')
const { createDaxUpdate: mockCreateDaxUpdate } = require('../../../app/processing/create-dax-update')
const { sendMessages: mockSendMessages } = require('../../../app/messaging/send-messages')
const { sendDemographicsFailureEvent: mockSendDemographicsFailureEvent } = require('../../../app/event')
const { getOutboundFileName: mockGetOutboundFileName } = require('../../../app/processing/get-outbound-file-name')
const { sendExtractMessage: mockSendExtractMessage } = require('../../../app/messaging/send-extract-message')

const content = require('../../mocks/file-content-manual-address')
const customerContent = require('../../mocks/customer-content')
const daxData = require('../../mocks/dax-data')
const daxUpdate = require('../../mocks/dax-update')
const filename = require('../../mocks/filename')
const outboundFilename = require('../../mocks/outbound-filename')

const processFile = require('../../../app/processing/process-file')
const { CUSTOMER: CUSTOMER_MSG } = require('../../../app/constants/message-types')
const { DAX, DEMOGRAPHICS } = require('../../../app/constants/containers')
const { DEMOGRAPHICS_PROCESSING_FAILED } = require('../../../app/constants/events')
const processingConfig = require('../../../app/config/processing')

const err = new Error('These are not the droids you\'re looking for')

describe('processFile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'log').mockImplementation(() => {})

    mockDownloadFile.mockResolvedValue(JSON.stringify(content))
    mockCreateCustomerUpdate.mockReturnValue(customerContent)
    mockSendMessages.mockReturnValue(true)
    mockCreateDaxData.mockReturnValue(daxData)
    mockCreateDaxUpdate.mockReturnValue(daxUpdate)
    mockUploadFile.mockResolvedValue(true)
    mockSendDemographicsFailureEvent.mockReturnValue(true)
    mockGetOutboundFileName.mockReturnValue(outboundFilename)
    mockSendExtractMessage.mockReturnValue(true)
    processingConfig.daxEnabled = false
  })

  test('should download file from file storage', async () => {
    await processFile(filename)
    expect(mockDownloadFile).toHaveBeenCalledWith(filename, DEMOGRAPHICS)
  })

  test('should create customer update', async () => {
    await processFile(filename)
    expect(mockCreateCustomerUpdate).toHaveBeenCalledWith(content.capparty[0].organisation, content.capparty[0].legacyIdentifier)
  })

  test('should send customer update', async () => {
    await processFile(filename)
    expect(mockSendMessages).toHaveBeenCalledWith(customerContent, CUSTOMER_MSG)
  })

  test('should not create dax data if daxEnabled false', async () => {
    await processFile(filename)
    expect(mockCreateDaxData).not.toHaveBeenCalled()
  })

  test('should create dax data and update if daxEnabled true', async () => {
    processingConfig.daxEnabled = true
    await processFile(filename)
    expect(mockCreateDaxData).toHaveBeenCalledWith(content.capparty[0])
    expect(mockCreateDaxUpdate).toHaveBeenCalledWith(daxData)
    expect(mockUploadFile).toHaveBeenCalledWith(outboundFilename, daxUpdate, DAX)
  })

  test('should send extract message', async () => {
    await processFile(filename)
    expect(mockSendExtractMessage).toHaveBeenCalledWith(content.capparty[0])
  })

  describe.each([
    ['downloadFile', mockDownloadFile],
    ['createCustomerUpdate', mockCreateCustomerUpdate],
    ['sendMessages', mockSendMessages],
    ['createDaxData', mockCreateDaxData, true],
    ['uploadFile', mockUploadFile, true],
    ['sendExtractMessage', mockSendExtractMessage]
  ])('error handling for %s', (name, mockFn, requiresDax = false) => {
    test(`should log error and send demographics failure event if ${name} fails`, async () => {
      mockFn.mockRejectedValue(err)
      if (requiresDax) processingConfig.daxEnabled = true
      await processFile(filename)
      expect(console.error).toHaveBeenCalledWith(err)
      expect(mockSendDemographicsFailureEvent).toHaveBeenCalledWith(filename, DEMOGRAPHICS_PROCESSING_FAILED, err.message)
    })
  })
})
