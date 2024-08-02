const getFileNameFromUrl = require('../../../app/messaging/get-file-name-from-url')

describe('get correct file name given a url path', () => {
  test('should return an empty string if the URL is null', () => {
    const result = getFileNameFromUrl(null)
    expect(result).toBe('')
  })

  test('should return an empty string if the URL is undefined', () => {
    const result = getFileNameFromUrl(undefined)
    expect(result).toBe('')
  })

  test('should return the file name from a simple URL', () => {
    const result = getFileNameFromUrl('http://example.com/path/to/file.txt')
    expect(result).toBe('file.txt')
  })

  test('should return the file name from a URL with a trailing slash', () => {
    const result = getFileNameFromUrl('http://example.com/path/to/file.txt/')
    expect(result).toBe('file.txt')
  })

  test('should return the last segment if the URL ends with a slash', () => {
    const result = getFileNameFromUrl('http://example.com/path/to/directory/')
    expect(result).toBe('directory')
  })

  test('should return an empty string if the URL has only a domain', () => {
    const result = getFileNameFromUrl('http://example.com/')
    expect(result).toBe('')
  })

  test('should return the file name from a complex URL with multiple segments', () => {
    const result = getFileNameFromUrl('http://example.com/dir1/dir2/file.txt')
    expect(result).toBe('file.txt')
  })
})
