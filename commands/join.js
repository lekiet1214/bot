const {
    SlashCommandBuilder
} = require(`@discordjs/builders`);

const {
    joinVoiceChannel
} = require('@discordjs/voice');
module.exports = {
    data: new SlashCommandBuilder()
        .setName(`join`)
        .setDescription(`Join user's voice channel`),
    async execute(interaction, client) {
        const channel = interaction.member.voice.channel;
        
        //Error case handling
        if (!channel) return interaction.channel.send('Please join a Voice Channel first!');

        const player = voiceDiscord.createAudioPlayer();
        const resource = voiceDiscord.createAudioResource('');

        const connection = voiceDiscord.joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        player.play(resource);
        connection.subscribe(player);
    },
};