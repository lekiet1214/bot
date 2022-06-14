const {
	SlashCommandBuilder
} = require('@discordjs/builders');
const {
	REST
} = require('@discordjs/rest');
const {
	Routes
} = require('discord-api-types/v9');
const path = require('node:path');
require('dotenv').config();
const fs = require('node:fs');


const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}
const rest = new REST({
	version: '9'
}).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.clientId), {
		body: commands
	})
	.then(() => console.log('Successfully registered application commands. ClientId: ' + process.env.clientId))
	.catch(console.error);