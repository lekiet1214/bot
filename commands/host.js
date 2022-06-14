const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
})
const os = require('node:os')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('host')
        .setDescription(`Replies with host's stats!`),
    async execute(interaction) {
        const operatingsys = os.platform + os.release;
        const ramstat = (os.freemem / 1024) / 1024 + '/' + (os.totalmem / 1024) / 1024;
        // const cpustat = os.cpus[0].model;
        const cpustat = 'undefined'
        console.log(os.cpus)
        const timenow = Date.now();
        const repli = new MessageEmbed()
            .setColor('LUMINOUS_VIVID_PINK')
            .setTitle('Host stats')
            .setURL('https://discord.com')
            .setDescription('Host statistic for nhobot')
            .addField(
                { name: 'CPU', value: 'undefined', inline: true },
                { name: 'RAM', value: ramstat, inline: true },
                { name: 'OS', value: operatingsys, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'nhobot by nho', iconURL: 'https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.6435-9/120544636_667386287527542_7324991427113116012_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Iq3_chh4co0AX_fV_M2&_nc_ht=scontent.fsgn2-5.fna&oh=00_AT9oX0pbkyoPItu1l-hJfHGFy0LTpt6RTQCBXSx8k5Qqng&oe=62CCD051' });
        return await interaction.reply({ embeds: [repli] });

    },
};