const { DisTube } = require('distube')
const Discord = require('discord.js')
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES
  ]
})
const fs = require('fs')
const config = require('./config.json')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const dotenv = require('dotenv')
dotenv.config()
const { wake } = require('./KeepAlive.js')
const logdna = require('@logdna/logger')

const options = {
  app: 'github',
  level: 'info' // set a default for when level is not provided in function calls
}

const logger = logdna.createLogger('103432aaec3b31a9af650c41daa2bff9', options)

client.config = require('./config.json')
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ],
  youtubeDL: false,
  searchSongs: 5,
  leaveOnEmpty: false,
  leaveOnFinish: false
})
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.emotes = config.emoji

fs.readdir('./commands/', (err, files) => {
  if (err) {
    console.log('Could not find any commands!')
    logger.error('Could not find any commands!')
    return
  }
  const jsFiles = files.filter(f => f.split('.').pop() === 'js')
  if (jsFiles.length <= 0) return console.log('Could not find any commands!')
  jsFiles.forEach(file => {
    const cmd = require(`./commands/${file}`)
    console.log(`Loaded ${file}`)
    logger.log(`Loaded ${file}`)
    client.commands.set(cmd.name, cmd)
    if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
  })
})

client.on('ready', () => {
  client.user.setStatus('idle')
  client.user.setActivity('Survival Solo', { type: 'COMPETING' })
  // const RichPresence = require('rich-presence-builder')
  // new RichPresence({ clientID: process.env.CLIENTID })
  //   .setState('Playing Solo (1 of 2)')
  //   .setDetails('Survival')
  //   .setLargeImage('sadbear', 'Numbani')
  //   .go()
  console.log(`${client.user.tag} is ready to play music.`)
  const app = require('express')()
  const PORT = process.env.PORT
  if (PORT) {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`)
      logger.log(`Listening on port ${PORT}`)
      wake()
    })
  }
  app.get('/', (req, res) => {
    res.send('Hi!')
  })
})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  const prefix = config.prefix
  if (!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return
  if (cmd.inVoiceChannel && !message.member.voice.channel) {
    return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
  }
  try {
    cmd.run(client, message, args)
  } catch (e) {
    console.error(e)
    logger.error(e)
    message.channel.send(`${client.emotes.error} | Error: \`${e}\``)
  }
})

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user
      }\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    // fs.writeFile('./logs/distupe-error.log', e.toString() + '\n', err => {
    //   if (err) {
    //     console.error(err)
    //     logger.error(err)
    //   }
    // })
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))
  .on('searchResult', (message, result) => {
    let i = 0
    message.channel.send(
      `**Choose an option from below**\n${result
        .map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``)
        .join('\n')}\n*Enter anything else or wait 60 seconds to cancel*`
    )
  })
  .on('searchCancel', message => message.channel.send(`${client.emotes.error} | Searching canceled`))
  .on('searchInvalidAnswer', message =>
    message.channel.send(
      `${client.emotes.error} | Invalid answer! You have to enter the number in the range of the results`
    )
  )
  .on('searchDone', () => { })

client.login(process.env.TOKEN || config.token)
client.on('error', (e) => {
  if (e) {
    // fs.writeFile('./logs/Discord-error.log', JSON.stringify(e, null, 2) + '\n', (e) => {
    //   if (e) console.error(e)
    // })
    logger.error(e)
  }
})
