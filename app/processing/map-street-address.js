const mapStreetAddress = (address) => {
  // address can be either entered manually or provided via lookup
  // this affects how address is provided.
  if (address.address1) {
    return mapManualAddress(address)
  } else if (address.street) {
    return mapLookupAddress(address)
  }
  return null
}

const mapManualAddress = (address) => {
  let addressString = address.address1
  if (address.address2) {
    addressString += ` ${address.address2}`
  }
  if (address.address3) {
    addressString += ` ${address.address3}`
  }
  if (address.address4) {
    addressString += ` ${address.address4}`
  }
  if (address.address5) {
    addressString += ` ${address.address5}`
  }
  return addressString
}

const mapLookupAddress = (address) => {
  let addressString = ''
  if (address.flatName) {
    addressString += address.flatName
  }
  if (address.buildingName) {
    addressString += ` ${address.buildingName}`
  }
  if (address.buildingNumberRange) {
    addressString += ` ${address.buildingNumberRange}`
  }
  addressString += ` ${address.street}`
  if (addressString.charAt(0) === ' ') {
    addressString = addressString.slice(1)
  }
  return addressString
}

module.exports = {
  mapStreetAddress
}
