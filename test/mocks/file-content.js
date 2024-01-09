const city = require('./city')
const country = require('./country')
const frn = require('./frn')
const firstName = require('./first-name')
const lastName = require('./last-name')
const middleName = require('./middle-name')
const title = require('./title')
const street1 = require('./street-1')
const street2 = require('./street-2')
const street3 = require('./street-3')
const street4 = require('./street-4')
const postCode = require('./post-code')
const addressRole = require('./address-role')

module.exports = {
  header: {
    externalSystem: 'CAP',
    externalMessageId: '405a84aa-3e6f-4600-9cb3-87fda2e6f900'
  },
  capparty: [
    {
      rev: 12219496,
      person: {
        rev: 12219496,
        partyId: 5108198,
        title,
        firstName,
        middleName,
        lastName,
        dateOfBirth: -125280000000,
        updateType: 'U',
        customerReference: frn,
        niNumber: null,
        personalIdentifier: '116136839',
        doNotContact: false,
        mdmId: null
      },
      organisation: null,
      phoneContact: [
        {
          partyId: 5108198,
          partyContactId: 338867,
          phoneContactTypeId: 101801,
          phoneNumber: '01234288568',
          updateType: 'U',
          mdmId: '16394610'
        },
        {
          partyId: 5108198,
          partyContactId: 338869,
          phoneContactTypeId: 101802,
          phoneNumber: '01234288569',
          updateType: 'U',
          mdmId: '16394620'
        }
      ],
      digitalContact: [],
      legacyIdentifier: [
        {
          partyId: 5108198,
          type: 'MDM Entity ID',
          value: '6566929'
        },
        {
          partyId: 5108198,
          type: 'PI',
          value: '116136839'
        }
      ],
      address: [
        {
          partyId: 5108198,
          partyAddressId: 266655,
          pafOrganisationName: null,
          flatName: null,
          buildingNumberRange: null,
          buildingName: null,
          street: null,
          city,
          county: null,
          country,
          postalCode: postCode,
          uprn: null,
          addressType: addressRole,
          address1: street1,
          address2: street2,
          address3: street3,
          address4: street4,
          address5: null,
          doubleDependentLocality: null,
          dependentLocality: null,
          updateType: 'U',
          mdmId: '6566929'
        }
      ]
    }
  ]
}
