const { countries } = require('../database')

const mapCountry = async (name) => {
  const country = (await countries().where({ name }).first()) ?? null
  if (country) {
    return country.countryCode
  }
  return null
}

module.exports = {
  mapCountry
}
