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
    AudioResource,
    StreamType
} = require('@discordjs/voice');
const fs = require('fs');
const ytdl = require('ytdl-core-discord');
const yts = require('yt-search');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription(`Play something!`)
        .addStringOption((option) => option.setName('song').setDescription('Song name to search').setRequired(false)),
    async execute(interaction) {
        try {
            const channel = interaction.member.voice.channel;

            // Handle no user voice channel
            if (!channel) return await interaction.reply('Please join a voice channel first!');

            // Search for song if existed
            const searchString = interaction.options.getString('song');
            let youtubeLink;

            if (!searchString) searchString = 'https://www.youtube.com/watch?v=7GQhyxSzlow';
            youtubeLink = await yts(searchString);
            if (!youtubeLink.all[0].length) {
                throw new Error('No results found for your search string. Please try a different one.');
            }
            youtubeLink = youtubeLink.all[0].url;

            // Create audio resource
            const player = createAudioPlayer();

            // Join user's voice channel and subcribe to audio resource
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            // Play audio
            const stream = createAudioResource(await ytdl(youtubeLink, {
                filter: "audioonly"
            }))
            fs.writeFile('play.log', JSON.stringify(await ytdl(youtubeLink, {
                filter: "audioonly"
            }), null, 2), 'utf-8', e => {
                if (e) throw e
            })
            player.play(stream)
            connection.subscribe(player);
        } catch (error) {
            fs.writeFile('playerror.log', JSON.stringify(error, null, 2), 'utf-8', e => {
                if (e) throw e
            })
        }
    },
};