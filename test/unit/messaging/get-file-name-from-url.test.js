const getFileNameFromUrl = require('../../../app/messaging/get-file-name-from-url')

describe('getFileNameFromUrl', () => {
  test('returns empty string if url is null', () => {
    const result = getFileNameFromUrl(null)
    expect(result).toBe('')
  })

  test('returns empty string if url is undefined', () => {
    const result = getFileNameFromUrl(undefined)
    expect(result).toBe('')
  })

  test('returns correct file name for simple URL', () => {
    const url = 'https://example.com/file.txt'
    const result = getFileNameFromUrl(url)
    expect(result).toBe('file.txt')
  })

  test('returns correct file name for URL with multiple segments', () => {
    const url = 'https://example.com/path/to/file.txt'
    const result = getFileNameFromUrl(url)
    expect(result).toBe('file.txt')
  })

  test('returns correct file name for URL with query parameters', () => {
    const url = 'https://example.com/file.txt?foo=bar&baz=qux'
    const result = getFileNameFromUrl(url)
    expect(result).toBe('file.txt')
  })

  test('returns correct file name for URL with hash', () => {
    const url = 'https://example.com/file.txt#section1'
    const result = getFileNameFromUrl(url)
    expect(result).toBe('file.txt')
  })
})
