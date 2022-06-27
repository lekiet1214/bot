module.exports = {
  name: 'radio',
  run: async (client, message, args) => {
    const string = 'https://www.youtube.com/watch?v=tFFy0yEYki0'
    const searchResult = await client.distube.search(string)
    if (!searchResult) return message.channel.send(`${client.emotes.error} | Something went wrong, please try again!.`)
    client.distube.play(message.member.voice.channel, searchResult[0], {
      member: message.member,
      textChannel: message.channel,
      message
    })
  }
}
