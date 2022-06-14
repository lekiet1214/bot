const {
    SlashCommandBuilder
} = require(`@discordjs/builders`);
const {
    Client,
    Intents
} = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
})
const voiceDiscord = require('@discordjs/voice');
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription(`Join user's voice channel`),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;

        // DEBUG
        // fs.writeFile('./join.log', JSON.stringify(channel, null, 2), 'utf-8', e => {
        //     if (e) throw e;
        // })

        //Error case handling
        if (!channel) return interaction.channel.send('Please join a Voice Channel first!');

        // Create voice connection
        const connection = voiceDiscord.joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: 'true',
            selfMute: 'false',
        });

        return await interaction.reply('Joined!')
    },
};