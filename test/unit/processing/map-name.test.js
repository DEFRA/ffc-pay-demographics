const { mapName } = require('../../../app/processing/map-name')

const fileContent = require('../../mocks/file-content')
const firstName = require('../../mocks/first-name')
const lastName = require('../../mocks/last-name')
const middleName = require('../../mocks/middle-name')
const title = require('../../mocks/title')

let person
describe('map name', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    person = { ...fileContent.capparty[0].person }
  })

  test('should return correct name if all of title, first name, middle name, last name provided', async () => {
    const result = await mapName(person)
    expect(result).toBe(`${title} ${firstName} ${middleName} ${lastName}`)
  })

  test('should return correct name if title missing', async () => {
    delete person.title
    const result = await mapName(person)
    expect(result).toBe(`${firstName} ${middleName} ${lastName}`)
  })

  test('should return correct name if first name missing', async () => {
    delete person.firstName
    const result = await mapName(person)
    expect(result).toBe(`${title} ${middleName} ${lastName}`)
  })

  test('should return correct name if middle name missing', async () => {
    delete person.middleName
    const result = await mapName(person)
    expect(result).toBe(`${title} ${firstName} ${lastName}`)
  })

  test('should return correct name if last name missing', async () => {
    delete person.lastName
    const result = await mapName(person)
    expect(result).toBe(`${title} ${firstName} ${middleName}`)
  })

  test('should return correct name if title and firstName missing', async () => {
    delete person.title
    delete person.firstName
    const result = await mapName(person)
    expect(result).toBe(`${middleName} ${lastName}`)
  })

  test('should return correct name if title and middleName missing', async () => {
    delete person.title
    delete person.middleName
    const result = await mapName(person)
    expect(result).toBe(`${firstName} ${lastName}`)
  })

  test('should return correct name if title and lastName missing', async () => {
    delete person.title
    delete person.lastName
    const result = await mapName(person)
    expect(result).toBe(`${firstName} ${middleName}`)
  })

  test('should return correct name if firstName and middleName missing', async () => {
    delete person.firstName
    delete person.middleName
    const result = await mapName(person)
    expect(result).toBe(`${title} ${lastName}`)
  })

  test('should return correct name if firstName and lastName missing', async () => {
    delete person.firstName
    delete person.lastName
    const result = await mapName(person)
    expect(result).toBe(`${title} ${middleName}`)
  })

  test('should return correct name if middleName and lastName missing', async () => {
    delete person.middleName
    delete person.lastName
    const result = await mapName(person)
    expect(result).toBe(`${title} ${firstName}`)
  })

  test('should return correct name if only title present', async () => {
    delete person.firstName
    delete person.middleName
    delete person.lastName
    const result = await mapName(person)
    expect(result).toBe(`${title}`)
  })

  test('should return correct name if only firstName present', async () => {
    delete person.title
    delete person.middleName
    delete person.lastName
    const result = await mapName(person)
    expect(result).toBe(`${firstName}`)
  })

  test('should return correct name if only middleName present', async () => {
    delete person.title
    delete person.firstName
    delete person.lastName
    const result = await mapName(person)
    expect(result).toBe(`${middleName}`)
  })

  test('should return correct name if only lastName present', async () => {
    delete person.title
    delete person.firstName
    delete person.middleName
    const result = await mapName(person)
    expect(result).toBe(`${lastName}`)
  })

  test('should return empty string if no name elements', async () => {
    delete person.title
    delete person.firstName
    delete person.middleName
    delete person.lastName
    const result = await mapName(person)
    expect(result).toBe('')
  })
})
