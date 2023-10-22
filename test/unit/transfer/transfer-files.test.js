jest.mock('../../../app/storage')
const { getPaymentFiles: mockGetPaymentFiles } = require('../../../app/storage')

jest.mock('../../../app/transfer/transfer-file')
const { transferFile: mockTransferFile } = require('../../../app/transfer/transfer-file')

const { transferFiles } = require('../../../app/transfer/transfer-files')

describe('transfer files', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetPaymentFiles.mockResolvedValue(['file1', 'file2'])
  })

  test('should transfer all files', async () => {
    await transferFiles()
    expect(mockGetPaymentFiles).toHaveBeenCalled()
    expect(mockTransferFile).toHaveBeenCalledTimes(2)
    expect(mockTransferFile).toHaveBeenCalledWith('file1')
    expect(mockTransferFile).toHaveBeenCalledWith('file2')
  })

  test('should not fail if a file transfer fails', async () => {
    mockTransferFile.mockRejectedValue(new Error('test error'))
    await transferFiles()
    expect(mockGetPaymentFiles).toHaveBeenCalled()
    expect(mockTransferFile).toHaveBeenCalledTimes(2)
    expect(mockTransferFile).toHaveBeenCalledWith('file1')
    expect(mockTransferFile).toHaveBeenCalledWith('file2')
  })
})
