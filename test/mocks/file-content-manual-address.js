const city = require('./city')
const country = require('./country')
const frn = require('./frn')
const sbi = require('./sbi')
const street1 = require('./address-1')
const street2 = require('./address-2')
const street3 = require('./address-3')
const street4 = require('./address-4')
const postCode = require('./post-code')
const addressRole = require('./address-role')
const name = require('./name')
const email = require('./email')
const vendor = require('./vendor')
const trader = require('./trader')
const businessTypeId = require('./business-type-id')

module.exports = {
  header: {
    externalSystem: 'CAP',
    externalMessageId: '405a84aa-3e6f-4600-9cb3-87fda2e6f900'
  },
  capparty: [
    {
      rev: 12219496,
      person: null,
      organisation: {
        rev: 12219496,
        partyId: 5108198,
        organisationName: name,
        sbi,
        taxRegistrationNumber: '180597090',
        legalStatusTypeId: 102111,
        businessTypeId,
        updateType: 'U',
        firmId: frn,
        vendornumber: vendor,
        tradernumber: trader,
        mdmId: '16394610',
        financialToBusinessAddr: null
      },
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
      digitalContact: [
        {
          partyId: 5108198,
          partyContactId: 3,
          digitalContactTypeId: 100301,
          digitalAddress: email,
          updateType: 'U',
          mdmId: '12993499',
          validated: false
        }
      ],
      legacyIdentifier: [
        {
          partyId: 5108198,
          type: 'SBI',
          value: sbi
        },
        {
          partyId: 5108198,
          type: 'Trader Number',
          value: trader
        },
        {
          partyId: 5108198,
          type: 'Vendor Number',
          value: vendor
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
