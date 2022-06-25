const {
  ShardingManager
} = require('discord.js')
require('dotenv').config()
const testShardList = []
testShardList.push(1306)
const manager = new ShardingManager('./bot.js', {
  token: process.env.TOKEN
})

manager.spawn()
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
    // Sending the data to the shard.
    shard.send({ type: 'shardId', data: { shardId: shard.id } })
  })
})
