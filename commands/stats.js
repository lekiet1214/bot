const Discord = require('discord.js')

module.exports = {
  name: 'stats',
  run: async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
      .setTitle('Stats')
      .setColor('DARK_VIVID_PINK')
      .setDescription(`
        **Servers:** ${client.guilds.cache.size}
        **Users:** ${client.users.cache.size}
        **Channels:** ${client.channels.cache.size}
        **Commands:** ${client.commands.size}
        **Uptime:** ${(Date(client.uptime).toString().split(' '))[4]}
      `)
    message.channel.send({ embeds: [embed] })
  }
}
