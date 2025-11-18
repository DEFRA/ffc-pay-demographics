const getFileNameFromUrl = require('../../../app/messaging/get-file-name-from-url')

describe('getFileNameFromUrl', () => {
  test.each([
    [null, ''],
    [undefined, ''],
    ['http://example.com/path/to/file.txt', 'file.txt'],
    ['http://example.com/path/to/file.txt/', 'file.txt'],
    ['http://example.com/path/to/directory/', 'directory'],
    ['http://example.com/', ''],
    ['http://example.com/dir1/dir2/file.txt', 'file.txt']
  ])('returns "%s" => "%s"', (url, expected) => {
    expect(getFileNameFromUrl(url)).toBe(expected)
  })
})
