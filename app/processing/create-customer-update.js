const createCustomerUpdate = async (organisation) => {
  // need clarity on how this looks in a sample sense
  if (organisation.sbi) {
    return {
      frn: organisation.frn,
      sbi: organisation.sbi
    }
  }
  if (organisation.trader) {
    return {
      frn: organisation.frn,
      trader: organisation.trader
    }
  }
  if (organisation.vendor) {
    return {
      frn: organisation.frn,
      vendor: organisation.vendor
    }
  }
}

module.exports = {
  createCustomerUpdate
}
