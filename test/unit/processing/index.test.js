jest.mock('../../../app/data')
const { start } = require('../../../app/processing')
jest.mock('../../../app/processing/process-files')
const { processFiles } = require('../../../app/processing/process-files')
const { processingConfig } = require('../../../app/config')

describe('processing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => { })
    processingConfig.daxEnabled = false
  })

  test('does not call processFiles if daxEnabled = false', async () => {
    await start()
    expect(processFiles).not.toHaveBeenCalled()
  })

  test('does call processFiles if daxEnabled = true', async () => {
    processingConfig.daxEnabled = true
    await start()
    expect(processFiles).toHaveBeenCalled()
  })

  test('catches error if processFiles errors', async () => {
    processingConfig.daxEnabled = true
    processFiles.mockRejectedValue('This is an error')
    await start()
    expect(console.error).toHaveBeenCalled()
    expect(console.error.mock.calls[0][0]).toBe('This is an error')
  })
})
