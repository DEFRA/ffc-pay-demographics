const { createServer } = require('./create-server')

const start = async () => {
  const server = await createServer()
  await server.start()
  console.log('Ready to receive demographics events')
}

module.exports = {
  start
}
