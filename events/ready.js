const { wake } = require('../KeepAlive.js')

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`)
    wake()
  }
}
