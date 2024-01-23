const db = require('../data')

const mapCountry = async (name) => {
  const country = await db.country.findOne({ where: { name } })
  if (country) {
    return country.countryCode
  }
  return null
}

module.exports = {
  mapCountry
}
