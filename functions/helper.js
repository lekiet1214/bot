const {
    Client,
    Intents
} = require('discord.js');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

const {
    Player
} = require("discord-music-player");

const player = new Player(client, {
    leaveOnEmpty: false,
    deafenOnJoin: true,
    timeout: 60,
    volume: 100,

});

client.player = player;

const {
    RepeatMode
} = require('discord-music-player');

let guildQueue;

function createGuildQueue(message) {
    guildQueue = client.player.getQueue(message.guild.id);
}

function skip() {
    if (!guildQueue) return;
    guildQueue.skip();
}

if (!guildQueue) return;

function stop() {
    if (!guildQueue) return;
    guildQueue.stop();
}

function removeLoop() {
    if (!guildQueue) return;
    guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
}

function Loop() {
    if (!guildQueue) return;
    guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
}

function queueLoop() {
    if (!guildQueue) return;
    guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
}

function setVolume(message) {
    if (!guildQueue) return;
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g).shift();
    guildQueue.setVolume(parseInt(args[0]));
}

function seek(message) {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g).shift();
    guildQueue.seek(parseInt(args[0]) * 1000);
}

function clearQueue() {
    guildQueue.clearQueue();
}

function shuffle() {
    guildQueue.shuffle();
}

function queue(message) {
    message.reply(guildQueue.getQueue)
}

function getVolumne(message) {
    message.reply('`' + guildQueue.getVolumne + '`')
}

function nowPlaying(message) {
    message.reply(`Now playing ${guildQueue.nowPlaying}`)
}

function pause() {
    guildQueue.setPaused(true);
}



function resume() {
    guildQueue.setPaused(false);
}

function remove(message) {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g).shift();
    let guildQueue = client.player.getQueue(message.guild.id);
    guildQueue.remove(parseInt(args[0]));
}

function createProgressBar(message) {
    if (!guildQueue) {
        message.reply("Please try playing something first!");
        return;
    }
    const ProgressBar = guildQueue.createProgressBar();

    // [======>              ][00:35/2:20]
    console.log(ProgressBar.prettier);
    message.reply(ProgressBar.prettier);
}

function play(message) {
    let queue = client.player.createQueue(message.guild.id);
    await queue.join(message.member.voice.channel);
    let song = await queue.play(args.join(' ')).catch(_ => {
        if (!guildQueue)
            queue.stop();
    });
}

function playlist(message) {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g).shift();
    let guildQueue = client.player.getQueue(message.guild.id);
    let queue = client.player.createQueue(message.guild.id);
    await queue.join(message.member.voice.channel);
    let song = await queue.playlist(args.join(' ')).catch(_ => {
        if (!guildQueue)
            queue.stop();
    });
}

module.exports = {
    play,
    remove,
    removeLoop,
    skip,
    play,
    clearQueue,
    createProgressBar,
    playlist,
    resume,
    pause,
    nowPlaying,
    getQueue,
    getVolumne,
    seek,
    setVolume,
    Loop,
    shuffle,
    queue,
    queueLoop,
    stop,
    createGuildQueue,
    guildQueue
}