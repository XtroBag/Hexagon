const { InteractionType} = require('discord.js');
const logger = require('../../types/logger')
const { LoggerTypes } = require('../../types/logger-types');


module.exports = {
    name: 'interactionCreate',
    async run(interaction, client) {

        if ((interaction.type === InteractionType.ApplicationCommand)) {
            const command = client.slashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.run(client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}
