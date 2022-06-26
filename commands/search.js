module.exports = {
  name: 'search',
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const string = args.join(' ')
    if (!string) return message.channel.send(`${client.emotes.error} | Please enter a song url or query to search.`)
    const searchRes = await client.distube.search(string, {
      type: 'video',
      limit: 10,
      safeSearch: true
    })
    if (!searchRes.length) return message.channel.send(`${client.emotes.error} | No results found for \`${string}\``)
    let i = 0
    message.channel.send(
            `**Choose an option from below**\n${searchRes
                .map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``)
                .join('\n')}\n*Enter anything else or wait 60 seconds to cancel*`
    )
    const filter = m => m.author.id === message.author.id
    const collector = message.channel.createMessageCollector(filter, { time: 60000 })
    collector.on('collect', m => {
      if (m.content.match(/^\d+$/)) {
        const index = parseInt(m.content) - 1
        if (index < 0 || index >= searchRes.length) {
          return message.channel.send(`${client.emotes.error} | Invalid index!`)
        }
        client.distube.play(message.member.voice.channel, searchRes[index], {
          member: message.member,
          textChannel: message.channel,
          message
        })
        collector.stop()
      }
    }
    )
    collector.on('end', collected => {
      if (collected.size === 0) {
        message.channel.send(`${client.emotes.error} | Search cancelled!`)
      }
    }
    )
  }
}
