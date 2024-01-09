const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const { storageConfig } = require('./config')
const { DEMOGRAPHICS } = require('./constants/file-types')
let blobServiceClient
let containersInitialised
let foldersInitialised

if (storageConfig.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionString)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const uri = `https://${storageConfig.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const demographicsContainer = blobServiceClient.getContainerClient(storageConfig.demographicsContainer)
const daxContainer = blobServiceClient.getContainerClient(storageConfig.daxContainer)

const initialiseContainers = async () => {
  if (storageConfig.enabled) {
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

const initialiseFolders = async () => {
  console.log('Making sure folders exist')
  const placeHolderText = 'Placeholder'
  const demographicsClient = demographicsContainer.getBlockBlobClient(`${storageConfig.demographicsFolder}/default.txt`)
  await demographicsClient.upload(placeHolderText, placeHolderText.length)
  const daxClient = daxContainer.getBlockBlobClient(`${storageConfig.daxFolder}/default.txt`)
  await daxClient.upload(placeHolderText, placeHolderText.length)
  foldersInitialised = true
  console.log('Folders ready')
}

const getBlob = async (filename, contName, folder) => {
  const fileContainer = contName === DEMOGRAPHICS ? demographicsContainer : daxContainer
  if (!folder) {
    folder = contName === DEMOGRAPHICS ? storageConfig.demographicsFolder : storageConfig.daxFolder
  }
  containersInitialised ?? await initialiseContainers()
  return fileContainer.getBlockBlobClient(`${folder}/${filename}`)
}

const getDemographicsFiles = async () => {
  containersInitialised ?? await initialiseContainers()
  const fileList = []
  for await (const item of demographicsContainer.listBlobsFlat({ prefix: storageConfig.demographicsFolder })) {
    if (item.kind === 'file' && /\d{7}_\d*.json$/.test(item.name)) {
      console.log(`Found item: ${item.name}`)
      fileList.push(item.name)
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

module.exports = {
  getDemographicsFiles,
  downloadFile,
  uploadFile,
  deleteFile
}
