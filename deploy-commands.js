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
}).setToken('Nzc4OTkwODI4OTY5Mzk0MjA3.G5gAkR.512Q5gBMHeTsGZ7TmfyGmvNUwxU1uTCvUOEoL0');
fs.writeFile('deploy-commands-error.log', JSON.stringify(commands, null, 2), 'utf-8', (e) => { if (e) throw e })
rest.put(
	Routes.applicationCommands('778990828969394207'),
	{
		body: commands
	})
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);