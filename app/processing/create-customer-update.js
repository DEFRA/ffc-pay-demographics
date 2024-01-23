const createCustomerUpdate = async (organisation, legacyDetails) => {
  const messages = []
  if (organisation.sbi) {
    messages.push({
      frn: organisation.firmId,
      sbi: organisation.sbi
    })
  } else {
    const sbi = findType(legacyDetails, 'SBI')
    if (sbi) {
      messages.push({
        frn: organisation.firmId,
        sbi: sbi.value
      })
    }
  }
  if (organisation.tradernumber) {
    messages.push({
      frn: organisation.firmId,
      trader: organisation.tradernumber
    })
  } else {
    const trader = findType(legacyDetails, 'Trader Number')
    if (trader) {
      messages.push({
        frn: organisation.firmId,
        trader: trader.value
      })
    }
  }
  if (organisation.vendornumber) {
    messages.push({
      frn: organisation.firmId,
      vendor: organisation.vendornumber
    })
  } else {
    const vendor = findType(legacyDetails, 'Vendor Number')
    if (vendor) {
      messages.push({
        frn: organisation.firmId,
        vendor: vendor.value
      })
    }
  }
  return messages
}

const findType = (array, type) => {
  if (!array) {
    return null
  }
  // Check if any element in the array has specific type
  // File format has sbi/trader/vendor in both org and legacyIdentifier section - this will catch as failsafe if missing from org
  return array.find(element => element && element.type === type)
}
module.exports = {
  createCustomerUpdate
}
