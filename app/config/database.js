const { PRODUCTION } = require('../constants/environments')

function isProd () {
  return process.env.NODE_ENV === PRODUCTION
}

const config = {
  database: process.env.POSTGRES_DB || 'ffc_pay_demographics',
  host: process.env.POSTGRES_HOST || 'ffc-pay-demographics-postgres',
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
  logging: process.env.POSTGRES_LOGGING || false,
  schema: process.env.POSTGRES_SCHEMA_NAME || 'public',
  ssl: isProd(),
  username: process.env.POSTGRES_USERNAME,
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
}

module.exports = config
