const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    Client,
    Intents
} = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
})
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const dateNow = new Date();
        const timePing = dateNow - interaction.createdTimestamp;
        await interaction.reply(`Pong!${timePing}ms`);
    },
};