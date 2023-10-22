const { downloadFile, uploadFile, deleteFile } = require('../storage')

const transferFile = async (file) => {
  console.log(`Transferring FDMR payment file: ${file}`)
  const data = await downloadFile(file)
  await uploadFile(file, data)
  await deleteFile(file)
  console.log(`Transferred FDMR payment file: ${file}`)
}

module.exports = {
  transferFile
}
