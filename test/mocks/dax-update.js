const addressRole = require('./address-role')
const city = require('./city')
const countryCode = require('./country-code')
const email = require('./email')
const frn = require('./frn')
const isTrader = require('./is-trader')
const name = require('./name')
const postCode = require('./post-code')
const street1 = require('./address-1')
const street2 = require('./address-2')
const street3 = require('./address-3')
const street4 = require('./address-4')
const vendGroup = require('./vend-group')

module.exports = `
  <Envelope>
    <Body>
      <MessageParts>
        <VendTable>
          <AccountNum>${frn}</AccountNum>
          <GSTraderEmail>${email}</GSTraderEmail>
          <GSTraderStatus>${isTrader ? 'Active' : 'NotATrader'}</GSTraderStatus>
          <Currency>GBP</Currency>
          <VendGroup>${vendGroup}</VendGroup>
          
          <DirPartyTable>
            <Name>${name}</Name>
            <UniquerecordDPT></UniquerecordDPT>
            
            <DirPartyPostalAddressView>
              <UniqueRecordDPPAddrRole>${addressRole}</UniqueRecordDPPAddrRole>
              <City>${city}</City>
              <CountryRegionId>${countryCode}</CountryRegionId>
              <IsPrimary>Yes</IsPrimary>
              <Roles>${addressRole}</Roles>
              <Street>${street1} ${street2} ${street3} ${street4}</Street>
              <ZipCode>${postCode}</ZipCode>
            </DirPartyPostalAddressView>
          </DirPartyTable>
        </VendTable>
      </MessageParts>
    </Body>
  </Envelope>
`
