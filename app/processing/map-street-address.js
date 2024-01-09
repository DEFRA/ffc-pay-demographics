const mapStreetAddress = (address) => {
  // asked for clarity on how the address works.
  let addressString = ''
  if (address.address1) {
    addressString += address.address1
  }
  if (address.address2) {
    addressString += ` ${address.address2}`
  }
  if (address.address3) {
    addressString += ` ${address.address3}`
  }
  if (address.address4) {
    addressString += ` ${address.address4}`
  }
  if (addressString.charAt(0) === ' ') {
    addressString = addressString.slice(1)
  }
  return addressString
}

module.exports = {
  mapStreetAddress
}
