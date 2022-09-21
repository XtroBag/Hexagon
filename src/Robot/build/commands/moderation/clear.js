const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('📜 Clear messages from a channel')
        //.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('amount of messages to delete')
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('pick a user to clear their messages')
        ),

    /**
    * @param {Client} client
    * @param {CommandInteraction} interaction
    */
    async run(client, interaction) {

        const { channel, options } = interaction

        const amount = options.getInteger('amount');
        const target = options.getUser('user');

        const messages = await channel.messages.fetch({
            limit: amount + 1
        });

        const res = new EmbedBuilder()
            .setColor('#2F3136')

        if (target) {
            let i = 0;
            const filitered = [];

            (messages).filter((msg) => {
                if (msg.author.id === target.id && amount > i) {
                    filitered.push(msg)
                    i++;
                }

            })

            await channel.bulkDelete(filitered).then(messages => {
                res.setDescription(`Deleted ${messages.size} from ${target}`)
                interaction.reply({ embeds: [res] });
            })
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                res.setDescription(`Deleted ${messages.size} from this channel`)
                interaction.reply({ embeds: [res] });
            })

        }

    }
};
