const mockGetContainerClient = jest.fn()
const mockUpload = jest.fn()
const mockBlob = {
  upload: mockUpload
}
const mockContainer = {
  getBlockBlobClient: jest.fn().mockReturnValue(mockBlob),
  createIfNotExists: jest.fn()
}
const mockBlobServiceClient = {
  getContainerClient: mockGetContainerClient.mockReturnValue(mockContainer)
}
jest.mock('@azure/storage-blob', () => {
  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockBlobServiceClient)
    }
  }
})
const mockGetShareClient = jest.fn()
const mockFileContent = 'content'
const mockDelete = jest.fn()
const mockFile = {
  downloadToBuffer: jest.fn().mockResolvedValue(Buffer.from(mockFileContent)),
  delete: mockDelete
}
const mockShare = {
  getDirectoryClient: jest.fn().mockReturnValue({
    listFilesAndDirectories: jest.fn().mockImplementation(async function * () {
      yield { name: 'FDMR_0001_AP_20231021202010120.dat', kind: 'file' }
      yield { name: 'file2', kind: 'file' }
    }),
    getFileClient: jest.fn().mockReturnValue(mockFile)
  })
}
const mockShareServiceClient = {
  getShareClient: mockGetShareClient.mockReturnValue(mockShare)
}
jest.mock('@azure/storage-file-share', () => {
  return {
    ShareServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockShareServiceClient)
    }
  }
})

const { getPaymentFiles, downloadFile, uploadFile, deleteFile } = require('../app/storage')

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('get payment files', () => {
    test('should return only payment files', async () => {
      const fileList = await getPaymentFiles()
      expect(fileList).toEqual(['FDMR_0001_AP_20231021202010120.dat'])
    })
  })

  describe('download file', () => {
    test('should download file', async () => {
      const fileContent = await downloadFile('file1')
      expect(fileContent).toEqual(mockFileContent)
    })
  })

  describe('upload file', () => {
    test('should upload file', async () => {
      await uploadFile('file1', 'content')
      expect(mockUpload).toHaveBeenCalledWith('content', 7)
    })
  })

  describe('delete file', () => {
    test('should delete file', async () => {
      await deleteFile('file1')
      expect(mockDelete).toHaveBeenCalled()
    })
  })
})
