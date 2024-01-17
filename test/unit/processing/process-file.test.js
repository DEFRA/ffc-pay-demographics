jest.mock('../../../app/storage')
const { downloadFile: mockDownloadFile, uploadFile: mockUploadFile, deleteFile: mockDeleteFile, quarantineFile: mockQuarantineFile } = require('../../../app/storage')

jest.mock('../../../app/processing/create-customer-update')
const { createCustomerUpdate: mockCreateCustomerUpdate } = require('../../../app/processing/create-customer-update')

jest.mock('../../../app/processing/create-dax-data')
const { createDaxData: mockCreateDaxData } = require('../../../app/processing/create-dax-data')

jest.mock('../../../app/processing/create-dax-update')
const { createDaxUpdate: mockCreateDaxUpdate } = require('../../../app/processing/create-dax-update')

jest.mock('../../../app/messaging')
const { sendMessages: mockSendMessages } = require('../../../app/messaging')

const content = require('../../mocks/file-content-manual-address')
const customerContent = require('../../mocks/customer-content')
const daxData = require('../../mocks/dax-data')

const { processFile } = require('../../../app/processing/process-file')
const { CUSTOMER: CUSTOMER_MSG } = require('../../../app/constants/message-types')

const filename = require('../../mocks/filename')
const daxUpdate = require('../../mocks/dax-update')
const outboundFilename = require('../../mocks/outbound-filename')
const { DAX, DEMOGRAPHICS } = require('../../../app/constants/containers')

const err = new Error('These are not the droids you\'re looking for')

describe('process file', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => { })
    mockDownloadFile.mockResolvedValue(JSON.stringify(content))
    mockCreateCustomerUpdate.mockReturnValue(customerContent)
    mockSendMessages.mockReturnValue(true)
    mockCreateDaxData.mockReturnValue(daxData)
    mockCreateDaxUpdate.mockReturnValue(daxUpdate)
    mockUploadFile.mockResolvedValue(true)
    mockDeleteFile.mockResolvedValue(true)
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

  test('if download fails, should quarantine file', async () => {
    mockDownloadFile.mockRejectedValue(err)
    await processFile(filename)
    expect(mockQuarantineFile).toHaveBeenCalled()
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

  test('if create customer update fails, should quarantine file', async () => {
    mockCreateCustomerUpdate.mockRejectedValue(err)
    await processFile(filename)
    expect(mockQuarantineFile).toHaveBeenCalled()
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

  test('if sending customer update fails, should quarantine file', async () => {
    mockSendMessages.mockRejectedValue(err)
    await processFile(filename)
    expect(mockQuarantineFile).toHaveBeenCalled()
  })

  test('should create dax data', async () => {
    await processFile(filename)
    expect(mockCreateDaxData).toHaveBeenCalledWith(content.capparty[0])
  })

  test('if creating dax data fails, should throw error', async () => {
    mockCreateDaxData.mockRejectedValue(err)
    await processFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('if creating dax data fails, should quarantine file', async () => {
    mockCreateDaxData.mockRejectedValue(err)
    await processFile(filename)
    expect(mockQuarantineFile).toHaveBeenCalled()
  })

  test('should create dax update', async () => {
    await processFile(filename)
    expect(mockCreateDaxUpdate).toHaveBeenCalledWith(daxData)
  })

  test('should upload file to file storage', async () => {
    await processFile(filename)
    expect(mockUploadFile).toHaveBeenCalledWith(outboundFilename, daxUpdate, DAX)
  })

  test('if uploading file fails, should throw error', async () => {
    mockUploadFile.mockRejectedValue(err)
    await processFile(filename)
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe(err)
  })

  test('if uploading file fails, should quarantine file', async () => {
    mockUploadFile.mockRejectedValue(err)
    await processFile(filename)
    expect(mockQuarantineFile).toHaveBeenCalled()
  })

  test('should delete file from file storage', async () => {
    await processFile(filename)
    expect(mockDeleteFile).toHaveBeenCalledWith(filename, DEMOGRAPHICS)
  })
})
