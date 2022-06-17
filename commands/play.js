const {
    SlashCommandBuilder
} = require(`@discordjs/builders`);
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
        .setName('play')
        .setDescription(`Play something!`)
        .addStringOption((option) => option.setName('song').setDescription('Song name to search').setRequired(false)),
    async execute(interaction) {
        try {
            const channel = interaction.member.voice.channel;

            // Handle no user voice channel
            if (!channel) return await interaction.reply('Please join a voice channel first!');

            // Search for song if existed
            let searchString = interaction.options.getString('song');
            let youtubeLink;
            if (!searchString) searchString = 'https://www.youtube.com/watch?v=7GQhyxSzlow';
            if (searchString) {
                youtubeLink = await yts(searchString);
                if (!youtubeLink) {
                    throw new Error('No results found for your search string. Please try a different one.');
                }
                youtubeLink = youtubeLink.all[0].url;
            }
            // Create audio resource
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });

            if(player.state != 'idle') return await interaction.reply('I am busy right now! Please try again later.')
            // Join user's voice channel and subcribe to audio resource
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            connection.subscribe(player);

            // Play audio
            const stream = await ytdl(youtubeLink, {
                filter: "audioonly"
            })
            const resource = createAudioResource(stream)
            player.play(resource)

            interaction.reply(`Playing ${youtubeLink}`)
            console.log(generateDependencyReport());
            player.on('error', (error) => {
                console.error('Error:', error.message);

            })
        } catch (e) {
            if (e) console.log(e)
        }
    },
};