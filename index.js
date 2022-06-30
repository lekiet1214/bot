const { ShardingManager } = require('discord.js')
require('dotenv').config()
const config = require('./config.json')
const bottoken = process.env.TOKEN || config.token
const manager = new ShardingManager('./bot.js', {
  token: bottoken
})
const logdna = require('@logdna/logger')

const options = {
  app: 'github',
  level: 'info' // set a default for when level is not provided in function calls
}

const logger = logdna.createLogger('103432aaec3b31a9af650c41daa2bff9', options)

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb+srv://nhobot:${process.env.MONGODB_PASSWORD}@discord0.ve7qj.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
client.connect(err => {
  const collection = client.db('test').collection('devices')
  if (err) logger.error('MongoDB error: ', err, '\n', collection)
  // perform actions on the collection object
  client.close()
})

manager
  .spawn()
  .then(shards => {
    shards.forEach(shard => {
      shard.on('message', message => {
        console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`)
      })
    })
  })
  .catch(console.error)

manager.on('shardCreate', shard => {
  shard.on('ready', () => {
    console.log(`[DEBUG/SHARD] Shard ${shard.id} connected to Discord's Gateway.`)
    logger.log(`[DEBUG/SHARD] Shard ${shard.id} connected to Discord's Gateway.`)
    // Sending the data to the shard.
    shard.send({ type: 'shardId', data: { shardId: shard.id } })
  })
})
