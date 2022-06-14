const {
    SlashCommandBuilder
} = require(`@discordjs/builders`);
const {
    createAudioPlayer,
    getVoiceConnection
} = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription(`Stop playing and leave voice channel`),
    async execute(interaction) {
        try {
            const connection = getVoiceConnection(interaction.guild.id);
            if(!connection) return await interaction.reply(`I'm not in a voice channel1`);
            const player = createAudioPlayer();
            player.stop();
            connection.destroy();
            return await interaction.reply('Stopped!');
        } catch (e) {
            if (e) console.log(e)
        }
    },
};