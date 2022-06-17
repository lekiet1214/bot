const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
})
const os = require('node:os')
const fs = require('node:fs')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('host')
        .setDescription(`Replies with host's stats!`),
    async execute(interaction) {
        const operatingsys = os.platform + os.release;
        const ramstat = Math.floor((os.freemem / 1024) / 1024 /1024) + 'GB free out of ' + Math.floor((os.totalmem / 1024) / 1024/1024) + ' GB';
        // const cpustat = os.cpus[0].model;
        const cpustat = os.cpus()[0].model;
        const elapsedTime = Date(Date.now() - process.env.STARTTIME).toString;
        const repli = {
            "color": 14637275,
            "author": {
                "name": "Host stat",
                "url": "https://www.facebook.com/le.kiet1214/",
                "icon_url": "https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.6435-9/120544636_667386287527542_7324991427113116012_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Iq3_chh4co0AX_fV_M2&_nc_ht=scontent.fsgn2-5.fna&oh=00_AT9oX0pbkyoPItu1l-hJfHGFy0LTpt6RTQCBXSx8k5Qqng&oe=62CCD051"
            },
            "title": "Host stat",
            "url": "https://dicord.com",
            "description": "Host stat for nhobot",
            "fields": [
                {
                    "name": "CPU",
                    "value": cpustat,
                    "inline": true
                },
                {
                    "name": "RAM",
                    "value": ramstat,
                    "inline": true
                },
                {
                    "name": "OS",
                    "value": operatingsys,
                    "inline": true
                },
                {
                    "name": "Uptime",
                    "value": elapsedTime,
                    "inline": false
                }
            ],
            timestamp: new Date()
        }
        return await interaction.reply({ embeds: [repli] });

    },
};