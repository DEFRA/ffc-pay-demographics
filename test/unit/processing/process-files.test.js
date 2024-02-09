jest.mock('../../../app/storage')
const { getDemographicsFiles: mockGetDemographicsFiles, getReturnFiles: mockGetReturnFiles } = require('../../../app/storage')

jest.mock('../../../app/processing/process-return-file')
const { processReturnFile: mockProcessReturnFile } = require('../../../app/processing/process-return-file')

const { processFiles } = require('../../../app/processing/process-files')

describe('transfer files', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetDemographicsFiles.mockResolvedValue(['file1', 'file2'])
    mockGetReturnFiles.mockResolvedValue(['file3', 'file4'])
  })

  test('should process all return files', async () => {
    await processFiles()
    expect(mockGetReturnFiles).toHaveBeenCalled()
    expect(mockProcessReturnFile).toHaveBeenCalledTimes(2)
    expect(mockProcessReturnFile).toHaveBeenCalledWith('file3')
    expect(mockProcessReturnFile).toHaveBeenCalledWith('file4')
  })

  test('should not fail if a return file fails', async () => {
    mockProcessReturnFile.mockRejectedValue(new Error('test error'))
    await processFiles()
    expect(mockGetReturnFiles).toHaveBeenCalled()
    expect(mockProcessReturnFile).toHaveBeenCalledTimes(2)
    expect(mockProcessReturnFile).toHaveBeenCalledWith('file3')
    expect(mockProcessReturnFile).toHaveBeenCalledWith('file4')
  })
})
