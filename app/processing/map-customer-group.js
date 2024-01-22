const db = require('../data')

const mapCustomerGroup = async (frn, rpGroup) => {
  if (frn) {
    const exception = await db.claimantException.findOne({ where: { frn } })
    if (exception) {
      return {
        daxGroup: exception.claimantGroup,
        isTrader: exception.isTrader
      }
    }
  }
  if (rpGroup) {
    const group = await db.claimantGroup.findOne({ where: { rpGroup } })
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
