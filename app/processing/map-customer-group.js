const db = require('../data')

const mapCustomerGroup = async (frn, businessTypeId) => {
  if (frn) {
    const exception = await db.claimantException.findOne({ where: { frn } })
    if (exception) {
      return {
        daxGroup: exception.claimantGroup,
        isTrader: exception.isTrader
      }
    }
  }
  if (businessTypeId) {
    const group = await db.claimantGroup.findOne({ where: { businessTypeId } })
    if (group) {
      return {
        daxGroup: group.daxGroup,
        isTrader: group.isTrader
      }
    }
  }
  return null
}

module.exports = {
  mapCustomerGroup
}
