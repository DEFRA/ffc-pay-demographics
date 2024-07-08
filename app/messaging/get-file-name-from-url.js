const getFileNameFromUrl = (url) => {
  if (url === null || typeof url === 'undefined') {
    return ''
  }
  const parsedUrl = new URL(url)
  const pathname = parsedUrl.pathname
  const segments = pathname.split('/').filter(segment => segment.length > 0)
  return segments.pop() ?? ''
}

module.exports = getFileNameFromUrl
