const getOutboundFileName = (filename, index) => {
  return `${filename.substring(0, filename.indexOf('.'))}-${index + 1}.xml`
}

module.exports = {
  getOutboundFileName
}
