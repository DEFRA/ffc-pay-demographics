const { claimantExceptions, claimantGroups } = require('../database')

const mapCustomerGroup = async (frn, businessTypeId) => {
  if (frn) {
    const exception = (await claimantExceptions().where({ frn }).first()) ?? null
    if (exception) {
      return {
        daxGroup: exception.claimantGroup,
        isTrader: exception.isTrader
      }
    }
  }
  if (businessTypeId) {
    const group = (await claimantGroups().where({ businessTypeId }).first()) ?? null
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
