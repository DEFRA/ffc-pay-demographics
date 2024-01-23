const { getOutboundFileName } = require('../../../app/processing/get-outbound-file-name')

const filename = require('../../mocks/filename')
const outboundFilename = require('../../mocks/outbound-filename')

describe('get outbound file name', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return correct file name', async () => {
    const result = await getOutboundFileName(filename, 0)
    expect(result).toBe(outboundFilename)
  })
})
