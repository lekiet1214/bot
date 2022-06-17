const {} = require('discord.js');
const wake = require('../KeepAlive.js')
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity("my life", {
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=e97w-GHsRMY"
        });

        // Set start time
        process.env.STARTTIME = Date.now();
        wake.wake();
    },
};