const helper = require('../functions/helper.js')

const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    createGuildQueue
} = require('../functions/helper');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play something')
        .addStringOption(option =>
            option.setName('song')
            .setRequired(true)),
    async execute(interaction) {
        if (!helper.guildQueue)
            helper.createGuildQueue();
            interaction.deferReply();
        await helper.play(interaction.options.getString('song'));
        interaction.reply(`Playing!`)
    },
};