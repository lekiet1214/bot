const config = require('../config.json')
module.exports = {
  name: 'messageCreate',
  on: true,
  async execute (message) {
    if (message.author.bot) return
    const prefix = config.prefix
    if (message.content.indexOf(prefix) !== 0) return
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    if (command === 'ping') {
      message.channel.send('Pong!')
    } else if (command === 'say') {
      message.channel.send(args.join(' '))
    } else if (command === 'help') {
      message.channel.send('Help!')
    } else if (command === 'kick') {
      if (!message.member.hasPermission('KICK_MEMBERS')) { return message.channel.send('You do not have permission to kick members.') }
      const user = message.mentions.users.first()
      if (!user) return message.channel.send('You must mention a user to kick.')
      const reason = args.slice(1).join(' ')
      if (!reason) return message.channel.send('You must provide a reason for the kick.')
      user
        .kick(reason)
        .catch(error => message.channel.send(`Sorry ${message.author} I couldn't kick because of : ${error}`))
      message.channel.send(`${user.tag} has been kicked by ${message.author.tag} because: ${reason}`)
    } else if (command === 'ban') {
      if (!message.member.hasPermission('BAN_MEMBERS')) { return message.channel.send('You do not have permission to ban members.') }
      const user = message.mentions.users.first()
      if (!user) return message.channel.send('You must mention a user to ban.')
      const reason = args.slice(1).join(' ')
      if (!reason) return message.channel.send('You must provide a reason for the ban.')
      user
        .ban(reason)
        .catch(error => message.channel.send(`Sorry ${message.author} I couldn't ban because of : ${error}`))
      message.channel.send(`${user.tag} has been banned by ${message.author.tag} because: ${reason}`)
    } else if (command === 'unban') {
      if (!message.member.hasPermission('BAN_MEMBERS')) { return message.channel.send('You do not have permission to unban members.') }
      const user = message.mentions.users.first()
      if (!user) return message.channel.send('You must mention a user to unban.')
      const reason = args.slice(1).join(' ')
      if (!reason) return message.channel.send('You must provide a reason for the unban.')
      message.guild
        .unban(user)
        .catch(error => message.channel.send(`Sorry ${message.author} I couldn't unban because of : ${error}`))
      message.channel.send(`${user.tag} has been unbanned by ${message.author.tag} because: ${reason}`)
    } else if (command === 'mute') {
      if (!message.member.hasPermission('MUTE_MEMBERS')) { return message.channel.send('You do not have permission to mute members.') }
      const user = message.mentions.users.first()
      if (!user) return message.channel.send('You must mention a user to mute.')
      const reason = args.slice(1).join(' ')
      if (!reason) return message.channel.send('You must provide a reason for the mute.')
      message.guild.member(user).roles.add(message.guild.roles.find('name', 'Muted'))
      message.channel.send(`${user.tag} has been muted by ${message.author.tag} because: ${reason}`)
    } else if (command === 'unmute') {
      if (!message.member.hasPermission('MUTE_MEMBERS')) { return message.channel.send('You do not have permission to unmute members.') }
      const user = message.mentions.users.first()
      if (!user) return message.channel.send('You must mention a user to unmute.')
      const reason = args.slice(1).join(' ')
      if (!reason) return message.channel.send('You must provide a reason for the unmute.')
      message.guild.member(user).roles.remove(message.guild.roles.find('name', 'Muted'))
      message.channel.send(`${user.tag} has been unmuted by ${message.author.tag} because: ${reason}`)
    } else if (command === 'warn') {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) { return message.channel.send('You do not have permission to warn members.') }
      const user = message.mentions.users.first()
      if (!user) return message.channel.send('You must mention a user to warn.')
      const reason = args.slice(1).join(' ')
      if (!reason) return message.channel.send('You must provide a reason for the warn.')
      message.guild.member(user).roles.add(message.guild.roles.find('name', 'Warned'))
      message.channel.send(`${user.tag} has been warned by ${message.author.tag} because: ${reason}`)
    } else if (command === 'unwarn') {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) { return message.channel.send('You do not have permission to unwarn members.') }
      const user = message.mentions.users.first()
      if (!user) return message.channel.send('You must mention a user to unwarn.')
      const reason = args.slice(1).join(' ')
      if (!reason) return message.channel.send('You must provide a reason for the unwarn.')
      message.guild.member(user).roles.remove(message.guild.roles.find('name', 'Warned'))
      message.channel.send(`${user.tag} has been unwarned by ${message.author.tag} because: ${reason}`)
    } else if (command === 'warns') {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) { return message.channel.send('You do not have permission to view warns.') }
      const user = message.mentions.users.first()
      if (!user) return message.channel.send('You must mention a user to view warns.')
      const reason = args.slice(1).join(' ')
      if (!reason) return message.channel.send('You must provide a reason for the warn.')
      message.guild.member(user).roles.remove(message.guild.roles.find('name', 'Warned'))
      message.channel.send(`${user.tag} has been unwarned by ${message.author.tag} because: ${reason}`)
    }
  }
}
