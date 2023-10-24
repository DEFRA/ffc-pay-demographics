const { ShareServiceClient } = require('@azure/storage-file-share')
const { storageConfig } = require('./config')
let shareServiceClient
let share
let folder

if (storageConfig.enabled) {
  shareServiceClient = ShareServiceClient.fromConnectionString(storageConfig.shareConnectionString)
  share = shareServiceClient.getShareClient(storageConfig.shareName)
  folder = share.getDirectoryClient(storageConfig.demographicsFolder)
}

const getDemographicsFiles = async () => {
  const fileList = []
  const dirIter = folder.listFilesAndDirectories()
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
  const file = folder.getFileClient(filename)
  const downloaded = await file.downloadToBuffer()
  return downloaded.toString()
}

const deleteFile = async (filename) => {
  const file = folder.getFileClient(filename)
  await file.delete()
}

module.exports = {
  getDemographicsFiles,
  downloadFile,
  deleteFile
}
