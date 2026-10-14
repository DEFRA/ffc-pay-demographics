const TABLES = require('./tables')

const COLUMNS = {
  [TABLES.claimantExceptions]: [
    'claimantExceptionId',
    'name',
    'frn',
    'claimantGroup',
    'isTrader'
  ],
  [TABLES.claimantGroups]: [
    'claimantGroupId',
    'rpGroup',
    'daxGroup',
    'isTrader',
    'businessTypeId'
  ],
  [TABLES.countries]: [
    'countryId',
    'name',
    'countryCode'
  ]
}

const pickColumns = (record, table) => {
  return Object.fromEntries(
    Object.entries(record)
      .filter(([column]) => COLUMNS[table].includes(column))
  )
}

module.exports = {
  COLUMNS,
  pickColumns
}
