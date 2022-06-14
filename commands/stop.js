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
            const connection = getVoiceConnection(interaction.guild_id);
            if(connection) connection.destroy();
            const player = createAudioPlayer();
            player.stop();
            return await interaction.reply('Stopped!');
        } catch (e) {
            if (e) console.log(e)
        }
    },
};