const { ShareServiceClient } = require('@azure/storage-file-share')
const { storageConfig } = require('./config')
let demographicsShareServiceClient
let demographicsShare
let demographicsFolder
let daxShareServiceClient
let daxShare
let daxFolder

if (storageConfig.enabled) {
  demographicsShareServiceClient = ShareServiceClient.fromConnectionString(storageConfig.demographicsShareConnectionString)
  demographicsShare = demographicsShareServiceClient.getShareClient(storageConfig.demographicsShareName)
  demographicsFolder = demographicsShare.getDirectoryClient(storageConfig.demographicsFolder)

  daxShareServiceClient = ShareServiceClient.fromConnectionString(storageConfig.daxShareConnectionString)
  daxShare = daxShareServiceClient.getShareClient(storageConfig.daxShareName)
  daxFolder = daxShare.getDirectoryClient(storageConfig.daxFolder)
}

const getDemographicsFiles = async () => {
  const fileList = []
  const dirIter = demographicsFolder.listFilesAndDirectories()
  for await (const item of dirIter) {
    console.log(`Found item: ${item.name}`)

    // Awaiting confirmation on file naming convention
    if (item.kind === 'file' && /^.*.json$/.test(item.name)) {
      fileList.push(item.name)
    }
  }

  return fileList
}

const downloadFile = async (filename) => {
  const file = demographicsFolder.getFileClient(filename)
  const downloaded = await file.downloadToBuffer()
  return downloaded.toString()
}

const uploadFile = async (filename, content) => {
  const file = daxFolder.getFileClient(filename)
  await file.create(content.length)
  await file.uploadRange(content, 0, content.length)
}

const deleteFile = async (filename) => {
  const file = demographicsFolder.getFileClient(filename)
  await file.delete()
}

module.exports = {
  getDemographicsFiles,
  downloadFile,
  uploadFile,
  deleteFile
}
