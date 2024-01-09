const mapName = async (person) => {
  // this may need a change depending on the response from the team.
  let personString = ''
  if (person.title) {
    personString += person.title
  }
  if (person.firstName) {
    personString += ` ${person.firstName}`
  }
  if (person.middleName) {
    personString += ` ${person.middleName}`
  }
  if (person.lastName) {
    personString += ` ${person.lastName}`
  }
  if (personString.charAt(0) === ' ') {
    personString = personString.slice(1)
  }
  return personString ?? null
}

module.exports = {
  mapName
}
