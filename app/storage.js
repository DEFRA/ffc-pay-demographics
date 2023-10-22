const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const { ShareServiceClient } = require('@azure/storage-file-share')
const { storageConfig } = require('./config')
let blobServiceClient
let shareServiceClient
let container
let share
let folder
let containersInitialised
let foldersInitialised

if (storageConfig.enabled) {
  shareServiceClient = ShareServiceClient.fromConnectionString(storageConfig.shareConnectionString)
  share = shareServiceClient.getShareClient(storageConfig.shareName)
  folder = share.getDirectoryClient(storageConfig.fdmrFolder)

  if (storageConfig.useConnectionStr) {
    console.log('Using connection string for BlobServiceClient')
    blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionStr)
  } else {
    console.log('Using DefaultAzureCredential for BlobServiceClient')
    const uri = `https://${storageConfig.storageAccount}.blob.core.windows.net`
    blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
  }

  container = blobServiceClient.getContainerClient(storageConfig.container)
}

const initialiseContainers = async () => {
  if (storageConfig.createContainers) {
    console.log('Making sure blob containers exist')
    await container.createIfNotExists()
    console.log('Containers ready')
  }
  foldersInitialised ?? await initialiseFolders()
  containersInitialised = true
}

const initialiseFolders = async () => {
  console.log('Making sure folders exist')
  const placeHolderText = 'Placeholder'
  const inboundClient = container.getBlockBlobClient(`${storageConfig.inboundFolder}/default.txt`)
  await inboundClient.upload(placeHolderText, placeHolderText.length)
  foldersInitialised = true
  console.log('Folders ready')
}

const getPaymentFiles = async () => {
  containersInitialised ?? await initialiseContainers()

  const fileList = []
  const dirIter = folder.listFilesAndDirectories()
  for await (const item of dirIter) {
    console.log(`Found item: ${item.name}`)

    if (item.kind === 'file' && /^FDMR_\d{4}_AP_\d*.dat$/.test(item.name)) {
      fileList.push(item.name)
    }
  }

  return fileList
}

const downloadFile = async (filename) => {
  const file = folder.getFileClient(filename)
  const downloaded = await file.downloadToBuffer()
  return downloaded.toString()
}

const uploadFile = async (filename, data) => {
  containersInitialised ?? await initialiseContainers()
  const blob = container.getBlockBlobClient(`${storageConfig.inboundFolder}/${filename}`)
  await blob.upload(data, data.length)
}

const deleteFile = async (filename) => {
  const file = folder.getFileClient(filename)
  await file.delete()
}

module.exports = {
  getPaymentFiles,
  downloadFile,
  uploadFile,
  deleteFile
}
