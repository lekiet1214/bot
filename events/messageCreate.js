const {
    Client,
    Intents,
    MessageEmbed
} = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});
const { Player } = require('discord-music-player');
const fs = require('fs');

client.player = new Player(client, {
    leaveOnEmpty: false,
    leaveOnEnd: false,
    leaveOnStop: false,
});

const helpMessage = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help')
    .setDescription('This is a help message.')
    .addFields(
        { name: '!play', value: 'Play a song.' },
        { name: '!skip', value: 'Skip the current song.' },
        { name: '!stop', value: 'Stop the player.' },
        { name: '!pause', value: 'Pause the player.' },
        { name: '!resume', value: 'Resume the player.' },
        { name: '!volume', value: 'Show the volume.' },
        { name: '!queue', value: 'Show the queue.' },
        { name: '!repeat', value: 'Repeat the current song.' },
        { name: '!shuffle', value: 'Shuffle the queue.' },
        { name: '!clear', value: 'Clear the queue.' },
        { name: '!np', value: 'Show the current song.' },
        { name: '!help', value: 'Show this message.' },
        { name: '!invite', value: 'Show the bot\'s invite link.' },
        { name: '!norepeat', value: 'Disable repeat.' },
        { name: '!progress', value: 'Show the progress of the current song.' },
        { name: '!setvolume', value: 'Set the volume of the player.' },
        { name: '!seek', value: 'Sek to a specific time of the current song.' },
    )
    .setTimestamp()
    .setFooter({ text: 'Made by @nh0#6764' });

client.login(process.env.TOKEN);

module.exports = {
    name: 'messageCreate',
    on: true,
    async execute(message) {
        if (message.author.bot) return;

        // DEBUG
        // console.debug(client.guilds.resolve(message.guild.id))
        // fs.writeFile('./message.debug.log', JSON.stringify(client.guilds.resolve(message.guild.id), null, 2), (err) => {
        //     if (err) message.channel.send(err);
        // }
        // )
        if (message.content.startsWith(process.env.PREFIX)) {
            let song;
            const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            let guildQueue = client.player.getQueue(message.guild.id);
            let queue = client.player.getQueue(message.guild.id);
            if(guildQueue === undefined && queue === undefined) {
                queue= client.player.createQueue(message.guild.id);
                guildQueue = queue;
            }
            // Pre handling command args
            switch (command) {
                case 'play':
                case 'playlist':
                    if (args.length === 0) {
                        message.channel.send('Please provide a link or a search query.');
                        return;
                    }
                    break;
            }
            switch (command) {
                case 'play':
                    await queue.join(message.member.voice.channel);
                    song = await queue.play(args.join(' ')).catch(_ => {
                        if (!guildQueue)
                            queue.stop();
                    });
                    break;
                case 'skip':
                    if (guildQueue) {
                        guildQueue.skip();
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'stop':
                    if (guildQueue) {
                        guildQueue.stop();
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'pause':
                    if (guildQueue) {
                        guildQueue.setPaused(true);
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'resume':
                    if (guildQueue) {
                        guildQueue.setPaused(false);
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'volume':
                    if (guildQueue) {
                        message.channel.send(`Volume is ${guildQueue.volume}`);
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'queue':
                    if (guildQueue) {
                        message.channel.send(guildQueue);
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'repeat':
                    if (guildQueue) {
                        guildQueue.setRepeatMode(1);
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'norepeat':
                    if (guildQueue) {
                        guildQueue.setRepeatMode(0);
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'shuffle':
                    if (guildQueue) {
                        guildQueue.Shuffle();
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'queueloop':
                    if (guildQueue) {
                        guildQueue.setRepeatMode(2);
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'setvolume':
                    if (guildQueue) {
                        guildQueue.setVolume(parseInt(args[0]));
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'np':
                    if (guildQueue) {
                        message.channel.send(`Now playing: ${guildQueue.nowPlaying}`);
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'help':
                    message.channel.send({ embeds: [helpMessage] });
                    break;
                case 'progress':
                    if (guildQueue) {
                        message.channel.send(`Progress: ${guildQueue.createProgressBar().prettier()}`);
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'clear':
                    if (guildQueue) {
                        guildQueue.clearQueue();
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'seek':
                    if (guildQueue) {
                        guildQueue.seek(parseInt(args[0] * 1000));
                    } else {
                        message.channel.send('No music is playing.');
                    }
                    break;
                case 'playlist':
                    let playlistqueue = client.player.createQueue(message.guild.id);
                    await playlistqueue.join(message.member.voice.channel);
                    song = await playlistqueue.playlist(args.join(' ')).catch(_ => {
                        if (!guildQueue)
                            queue.stop();
                    });
                    break;
                case 'radio':
                    await queue.join(message.member.voice.channel);
                    song = await queue.play('lofi radio').catch(_ => {
                        if (!guildQueue)
                            queue.stop();
                    });
                    break;
                default:
                    message.channel.send('Command not found.');
                    break;
            }

            // Init event listener for player
            client.player
                // Emitted when channel was empty.
                .on('channelEmpty', (queue) =>
                    message.channel.send(`Everyone left the Voice Channel, queue ended.`))
                // Emitted when a song was added to the queue.
                .on('songAdd', (queue, song) =>
                    message.channel.send(`Song ${song} was added to the queue.`))
                // Emitted when a playlist was added to the queue.
                .on('playlistAdd', (queue, playlist) =>
                    message.channel.send(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`))
                // Emitted when there was no more music to play.
                .on('queueDestroyed', (queue) =>
                    message.channel.send(`The queue was destroyed.`))
                // Emitted when the queue was destroyed (either by ending or stopping).    
                .on('queueEnd', (queue) =>
                    message.channel.send(`The queue has ended.`))
                // Emitted when a song changed.
                .on('songChanged', (queue, newSong, oldSong) =>
                    message.channel.send(`${newSong} is now playing.`))
                // Emitted when a first song in the queue started playing.
                .on('songFirst', (queue, song) =>
                    message.channel.send(`Started playing ${song}.`))
                // Emitted when someone disconnected the bot from the channel.
                .on('clientDisconnect', (queue) =>
                    message.channel.send(`I was kicked from the Voice Channel, queue ended.`))
                // Emitted when deafenOnJoin is true and the bot was undeafened
                .on('clientUndeafen', (queue) =>
                    message.channel.send(`I got undefeanded.`))
                // Emitted when there was an error in runtime
                .on('error', (error, queue) => {
                    message.channel.send(`Error: ${error} in ${queue.guild.name}`);
                });
        }
    },
}