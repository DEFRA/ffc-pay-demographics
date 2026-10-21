const TABLES = require('../../../app/constants/tables')
const { pickColumns } = require('../../../app/constants/columns')

describe('pickColumns', () => {
  test('keeps properties that are columns on the table', () => {
    const record = { claimantExceptionId: 1, name: 'value' }

    expect(pickColumns(record, TABLES.claimantExceptions)).toEqual(record)
  })

  test('drops properties that are not columns on the table', () => {
    const result = pickColumns({ claimantExceptionId: 1, notAColumn: 'value' }, TABLES.claimantExceptions)

    expect(result).toEqual({ claimantExceptionId: 1 })
  })

  test('returns an empty object when given no properties', () => {
    expect(pickColumns({}, TABLES.claimantExceptions)).toEqual({})
  })
})
