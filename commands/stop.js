const {
    SlashCommandBuilder
} = require(`@discordjs/builders`);
const {
    createAudioPlayer,
} = require('@discordjs/voice');

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