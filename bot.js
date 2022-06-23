// Require the necessary discord.js classes
const {
	Client,
	Intents,
	Collection
} = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

// Create a new client instance
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

// Pre-commands handling
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// Commands handling
client.on('interactionCreate', async interaction => {
	if (!interaction.isApplicationCommand) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true
		});
	}
});

// Events handling, exclude commands
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to Discord with your client's token
client.login(process.env.TOKEN);

// Handle shard manager messages
process.on('message', msg => {
	if (!msg.type) return;

	if (msg.type == 'shardId') console.log(`The shard id is: ${msg.data.shardId}`);
})