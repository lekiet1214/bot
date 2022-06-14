const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {Client, Intents} = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription(`Replies with bot's stats!`),
    async execute(interaction) {
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        ];
        return Promise.all(promises)
            .then(results => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
                return interaction.reply(`Server count: ${totalGuilds}\nMember count: ${totalMembers}`);
            })
            .catch(e => {
                if(e) console.log(e);
            });
    },
};