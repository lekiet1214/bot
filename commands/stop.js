const {
    SlashCommandBuilder
} = require(`@discordjs/builders`);
const {
    Client,
    Intents
} = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES]
})
const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    generateDependencyReport,
    NoSubscriberBehavior,
} = require('@discordjs/voice');
const fs = require('fs');
const ytdl = require('ytdl-core-discord');
const yts = require('yt-search');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription(`Stop playing and leave voice channel`),
    async execute(interaction) {
        try {
            const player = createAudioPlayer();
            player.stop();
        } catch (e) {
            if (e) console.log(e)
        }
    },
};