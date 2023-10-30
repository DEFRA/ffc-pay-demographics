const mockGetShareClient = jest.fn()
const mockFileContent = 'content'
const mockDelete = jest.fn()
const mockCreate = jest.fn()
const mockUploadRange = jest.fn()
const mockFile = {
  downloadToBuffer: jest.fn().mockResolvedValue(Buffer.from(mockFileContent)),
  delete: mockDelete,
  create: mockCreate,
  uploadRange: mockUploadRange
}
const mockShare = {
  getDirectoryClient: jest.fn().mockReturnValue({
    listFilesAndDirectories: jest.fn().mockImplementation(async function * () {
      yield { name: 'customer.json', kind: 'file' }
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

const { getDemographicsFiles, downloadFile, uploadFile, deleteFile } = require('../app/storage')

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('get demographics files', () => {
    test('should return only demographics files', async () => {
      const fileList = await getDemographicsFiles()
      expect(fileList).toEqual(['customer.json'])
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
      expect(mockCreate).toHaveBeenCalled()
      expect(mockUploadRange).toHaveBeenCalled()
    })
  })

  describe('delete file', () => {
    test('should delete file', async () => {
      await deleteFile('file1')
      expect(mockDelete).toHaveBeenCalled()
    })
  })
})