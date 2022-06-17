const { REST } = require('@discordjs/rest');
const {
    ShardingManager
} = require('discord.js');
const { Const } = require('sodium');
require('dotenv').config();
const testShardList = []
testShardList.push(1306)
const manager = new ShardingManager('./bot.js', {
    token: process.env.TOKEN,
    totalShards: 'auto',
    shardList: [1306, 810],
    respawn: 'true',
});

manager.spawn()
    .then(shards => {
        shards.forEach(shard => {
            shard.on('message', message => {
                console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
            });
        });
    })
    .catch(console.error);

manager.on('shardCreate', shard => {
    shard.on("ready", () => {
        console.log(`[DEBUG/SHARD] Shard ${shard.id} connected to Discord's Gateway.`)
        // Sending the data to the shard.
        shard.send({type: "shardId", data: {shardId: shard.id}});
    });
});

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('You should not be here!');
  res.end();
}).listen(process.env.PORT);