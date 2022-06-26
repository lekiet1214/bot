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
  }
}
