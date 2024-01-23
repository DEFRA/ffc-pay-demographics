const createDaxUpdate = (data) => {
  return `
    <Envelope>
      <Body>
        <MessageParts>
          <VendTable>
            <AccountNum>${data.accountNum}</AccountNum>
            <GSTraderEmail>${data.gsTraderEmail}</GSTraderEmail>
            <GSTraderStatus>${data.gsTraderStatus}</GSTraderStatus>
            <Currency>GBP</Currency>
            <VendGroup>${data.vendGroup}</VendGroup>
            
            <DirPartyTable>
              <Name>${data.name}</Name>
              <UniquerecordDPT></UniquerecordDPT>
              
              <DirPartyPostalAddressView>
                <UniqueRecordDPPAddrRole>${data.uniqueRecordDPPAddrRole}</UniqueRecordDPPAddrRole>
                <City>${data.city}</City>
                <CountryRegionId>${data.countryRegionId}</CountryRegionId>
                <IsPrimary>Yes</IsPrimary>
                <Roles>${data.roles}</Roles>
                <Street>${data.street}</Street>
                <ZipCode>${data.zipCode}</ZipCode>
              </DirPartyPostalAddressView>
            </DirPartyTable>
          </VendTable>
        </MessageParts>
      </Body>
    </Envelope>
  `
}

module.exports = {
  createDaxUpdate
}
