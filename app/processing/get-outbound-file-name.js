const getOutboundFileName = (filename, index) => {
  return `${filename.substring(0, filename.indexOf('.'))}.xml`
}

module.exports = {
  getOutboundFileName
}
