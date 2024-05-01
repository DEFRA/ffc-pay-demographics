const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/demographics')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server) => {
      server.route(routes)
    }
  }
}
