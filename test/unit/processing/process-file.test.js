jest.mock('../../../app/storage')
const { downloadFile: mockDownloadFile, uploadFile: mockUploadFile } = require('../../../app/storage')

jest.mock('../../../app/processing/create-customer-update')
const { createCustomerUpdate: mockCreateCustomerUpdate } = require('../../../app/processing/create-customer-update')

jest.mock('../../../app/processing/create-dax-data')
const { createDaxData: mockCreateDaxData } = require('../../../app/processing/create-dax-data')

jest.mock('../../../app/processing/create-dax-update')
const { createDaxUpdate: mockCreateDaxUpdate } = require('../../../app/processing/create-dax-update')

jest.mock('../../../app/messaging/send-messages')
const { sendMessages: mockSendMessages } = require('../../../app/messaging/send-messages')

jest.mock('../../../app/event')
const { sendDemographicsFailureEvent: mockSendDemographicsFailureEvent } = require('../../../app/event')

jest.mock('../../../app/processing/get-outbound-file-name')
const { getOutboundFileName: mockGetOutboundFileName } = require('../../../app/processing/get-outbound-file-name')

jest.mock('../../../app/messaging/send-extract-message')
const { sendExtractMessage: mockSendExtractMessage } = require('../../../app/messaging/send-extract-message')

const content = require('../../mocks/file-content-manual-address')
const customerContent = require('../../mocks/customer-content')
const daxData = require('../../mocks/dax-data')

const processFile = require('../../../app/processing/process-file')
const { CUSTOMER: CUSTOMER_MSG } = require('../../../app/constants/message-types')

const filename = require('../../mocks/filename')
const daxUpdate = require('../../mocks/dax-update')
const outboundFilename = require('../../mocks/outbound-filename')
const { DAX, DEMOGRAPHICS } = require('../../../app/constants/containers')
const { DEMOGRAPHICS_PROCESSING_FAILED } = require('../../../app/constants/events')
const processingConfig = require('../../../app/config/processing')

const err = new Error({ message: 'These are not the droids you\'re looking for' })

describe('process file', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => { })
    jest.spyOn(console, 'log').mockImplementation(() => { })
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

  test('if download fails, should throw error', async () => {
    mockDownloadFile.mockRejectedValue(err)
    await processFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('should send demographics failure event if download fails', async () => {
    mockDownloadFile.mockRejectedValue(err)
    await processFile(filename)
    expect(mockSendDemographicsFailureEvent).toHaveBeenCalledWith(filename, DEMOGRAPHICS_PROCESSING_FAILED, err.message)
  })

  test('should create customer update', async () => {
    await processFile(filename)
    expect(mockCreateCustomerUpdate).toHaveBeenCalledWith(content.capparty[0].organisation, content.capparty[0].legacyIdentifier)
  })

  test('if create customer update fails, should throw error', async () => {
    mockCreateCustomerUpdate.mockRejectedValue(err)
    await processFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('should send demographics failure event if create customer update fails', async () => {
    mockCreateCustomerUpdate.mockRejectedValue(err)
    await processFile(filename)
    expect(mockSendDemographicsFailureEvent).toHaveBeenCalledWith(filename, DEMOGRAPHICS_PROCESSING_FAILED, err.message)
  })

  test('should send customer update', async () => {
    await processFile(filename)
    expect(mockSendMessages).toHaveBeenCalledWith(customerContent, CUSTOMER_MSG)
  })

  test('if sending customer update fails, should throw error', async () => {
    mockSendMessages.mockRejectedValue(err)
    await processFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('should send demographics failure event if sending customer update fails', async () => {
    mockSendMessages.mockRejectedValue(err)
    await processFile(filename)
    expect(mockSendDemographicsFailureEvent).toHaveBeenCalledWith(filename, DEMOGRAPHICS_PROCESSING_FAILED, err.message)
  })

  test('should not create dax data', async () => {
    await processFile(filename)
    expect(mockCreateDaxData).not.toHaveBeenCalled()
  })

  test('should create dax data if daxEnabled', async () => {
    processingConfig.daxEnabled = true
    await processFile(filename)
    expect(mockCreateDaxData).toHaveBeenCalledWith(content.capparty[0])
  })

  test('if creating dax data fails, should throw error', async () => {
    mockCreateDaxData.mockRejectedValue(err)
    processingConfig.daxEnabled = true
    await processFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('should send demographics failure event if creating dax data fails', async () => {
    mockCreateDaxData.mockRejectedValue(err)
    processingConfig.daxEnabled = true
    await processFile(filename)
    expect(mockSendDemographicsFailureEvent).toHaveBeenCalledWith(filename, DEMOGRAPHICS_PROCESSING_FAILED, err.message)
  })

  test('should not create dax update', async () => {
    await processFile(filename)
    expect(mockCreateDaxUpdate).not.toHaveBeenCalled()
  })

  test('should create dax update if daxEnabled', async () => {
    processingConfig.daxEnabled = true
    await processFile(filename)
    expect(mockCreateDaxUpdate).toHaveBeenCalledWith(daxData)
  })

  test('should not upload file to file storage', async () => {
    await processFile(filename)
    expect(mockUploadFile).not.toHaveBeenCalled()
  })

  test('should upload file to file storage', async () => {
    processingConfig.daxEnabled = true
    await processFile(filename)
    expect(mockUploadFile).toHaveBeenCalledWith(outboundFilename, daxUpdate, DAX)
  })

  test('if uploading file fails, should throw error', async () => {
    mockUploadFile.mockRejectedValue(err)
    processingConfig.daxEnabled = true
    await processFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('should send demographics failure event if uploading file fails', async () => {
    mockUploadFile.mockRejectedValue(err)
    processingConfig.daxEnabled = true
    await processFile(filename)
    expect(mockSendDemographicsFailureEvent).toHaveBeenCalledWith(filename, DEMOGRAPHICS_PROCESSING_FAILED, err.message)
  })

  test('should send extract message', async () => {
    await processFile(filename)
    expect(mockSendExtractMessage).toHaveBeenCalledWith(content.capparty[0])
  })

  test('if sending extract message fails, should throw error', async () => {
    mockSendExtractMessage.mockRejectedValue(err)
    await processFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('should send demographics failure event if sending extract message fails', async () => {
    mockSendExtractMessage.mockRejectedValue(err)
    await processFile(filename)
    expect(mockSendDemographicsFailureEvent).toHaveBeenCalledWith(filename, DEMOGRAPHICS_PROCESSING_FAILED, err.message)
  })
})
