const { DefaultAzureCredential, ClientSecretCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const { storageConfig } = require('./config')
const { DEMOGRAPHICS, DAX } = require('./constants/containers')

let blobServiceClient
let daxBlobServiceClient
let foldersInitialised
let demographicsContainer
let daxContainer
let containersInitialised = false

const setupBlobServiceClient = () => {
  if (storageConfig.useConnectionStr) {
    console.log('Using connection string for BlobServiceClient')
    blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionString)
  } else {
    const uri = `https://${storageConfig.storageAccount}.blob.core.windows.net`
    let credential
    if (storageConfig.demographicsClientId && storageConfig.demographicsClientSecret && storageConfig.demographicsTenantId) {
      console.log('Using Service Principal for BlobServiceClient')
      credential = new ClientSecretCredential(
        storageConfig.demographicsTenantId,
        storageConfig.demographicsClientId,
        storageConfig.demographicsClientSecret
      )
    } else {
      console.log('Using DefaultAzureCredential for BlobServiceClient')
      credential = new DefaultAzureCredential({ managedIdentityClientId: storageConfig.managedIdentityClientId })
    }
    blobServiceClient = new BlobServiceClient(uri, credential)
  }
  demographicsContainer = blobServiceClient.getContainerClient(storageConfig.demographicsContainer)
}

const setupDaxBlobServiceClient = () => {
  if (storageConfig.useDaxConnectionStr) {
    console.log('Using connection string for FCP BlobServiceClient')
    daxBlobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionString)
  } else {
    console.log('Using DefaultAzureCredential for FCP BlobServiceClient')
    daxBlobServiceClient = new BlobServiceClient(`https://${storageConfig.daxStorageAccount}.blob.core.windows.net`, new DefaultAzureCredential({ managedIdentityClientId: storageConfig.managedIdentityClientId }))
  }
  daxContainer = daxBlobServiceClient.getContainerClient(storageConfig.daxContainer)
}

const initialiseContainers = async () => {
  if (storageConfig.enabled) {
    if (!containersInitialised) {
      setupBlobServiceClient()
      setupDaxBlobServiceClient()
      if (storageConfig.createContainers) {
        console.log('Making sure blob containers exist')
        await demographicsContainer.createIfNotExists()
        await daxContainer.createIfNotExists()
        console.log('Containers ready')
      }
      foldersInitialised ?? await initialiseFolders()
      containersInitialised = true
    }
  }
}

const initialiseFolders = async () => {
  console.log('Making sure folders exist')
  const placeHolderText = 'Placeholder'
  const daxClient = daxContainer.getBlockBlobClient(`${storageConfig.daxFolder}/default.txt`)
  await daxClient.upload(placeHolderText, placeHolderText.length)
  const daxOutboundClient = daxContainer.getBlockBlobClient(`${storageConfig.daxOutboundFolder}/default.txt`)
  await daxOutboundClient.upload(placeHolderText, placeHolderText.length)
  foldersInitialised = true
  console.log('Folders ready')
}

const getBlob = async (filename, contName, folder) => {
  const fileContainer = contName === DEMOGRAPHICS ? demographicsContainer : daxContainer
  if (!folder && contName === DAX) {
    folder = storageConfig.daxOutboundFolder
  }
  containersInitialised ?? await initialiseContainers()
  return folder ? fileContainer.getBlockBlobClient(`${folder}/${filename}`) : fileContainer.getBlockBlobClient(filename)
}

const getDemographicsFiles = async () => {
  containersInitialised ?? await initialiseContainers()
  const fileList = []
  for await (const item of demographicsContainer.listBlobsFlat()) {
    if (/\d{7}_\d*.json$/.test(item.name)) {
      console.log(`Found item: ${item.name}`)
      fileList.push(item.name)
    }
  }

  return fileList
}

const getReturnFiles = async () => {
  containersInitialised ?? await initialiseContainers()
  const fileList = []
  for await (const item of daxContainer.listBlobsFlat({ prefix: storageConfig.daxOutboundFolder })) {
    const filename = item.name.replace(`${storageConfig.daxOutboundFolder}/`, '')
    if (/^Claimant Update \d{4}-\d{2}-\d{2} \d{6}Ack\.xml$/.test(filename)) {
      console.log(`Found return file: ${filename}`)
      fileList.push(filename)
    }
  }

  return fileList
}

const downloadFile = async (filename, contName) => {
  const file = await getBlob(filename, contName)
  const downloaded = await file.downloadToBuffer()
  return downloaded.toString()
}

const uploadFile = async (filename, content, contName) => {
  const blobClient = await getBlob(filename, contName)
  await blobClient.upload(content, content.length)
}

const deleteFile = async (filename, contName) => {
  const blobClient = await getBlob(filename, contName)
  await blobClient.delete()
}

const quarantineFile = async (filename, contName) => {
  const sourceBlob = await getBlob(filename, contName)
  const destinationBlob = await getBlob(filename, contName, 'quarantine')
  const copyResult = await (await destinationBlob.beginCopyFromURL(sourceBlob.url)).pollUntilDone()

  if (copyResult.copyStatus === 'success') {
    await sourceBlob.delete()
    return true
  }

  return false
}

const archiveFile = async (filename, contName) => {
  const sourceBlob = await getBlob(filename, contName)
  const destinationBlob = await getBlob(filename, contName, `${storageConfig.daxOutboundFolder}/Archives`)
  const copyResult = await (await destinationBlob.beginCopyFromURL(sourceBlob.url)).pollUntilDone()

  if (copyResult.copyStatus === 'success') {
    await sourceBlob.delete()
    return true
  }

  return false
}

// Helper functions to reset state for testing purposes
const resetInitialisationState = () => {
  containersInitialised = false
  foldersInitialised = false
}

module.exports = {
  initialiseContainers,
  getDemographicsFiles,
  getReturnFiles,
  downloadFile,
  uploadFile,
  deleteFile,
  quarantineFile,
  archiveFile,
  _testOnly: {
    resetInitialisationState
  }
}
