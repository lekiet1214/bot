module.exports = {
  name: 'interactionCreate',
  run: async (interaction) => {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`)
  }
}
