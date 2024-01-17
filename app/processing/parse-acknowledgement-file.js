const xml2js = require('xml2js')

const parseAcknowledgementFile = async (xml) => {
  const parser = new xml2js.Parser()
  const acknowledgementData = await parser.parseStringPromise(xml)
  return {
    succeeded: parseInt(acknowledgementData.Envelope.Header[0].Succeeded[0]),
    failed: parseInt(acknowledgementData.Envelope.Header[0].Failed[0]),
    acknowledged: new Date(),
    failedFRNs: acknowledgementData.Envelope.Lines[0].Line
      .filter(line => line.Success[0] === 'FALSE')
      .map(failedLine => failedLine.SupplierID[0])
  }
}

module.exports = {
  parseAcknowledgementFile
}
