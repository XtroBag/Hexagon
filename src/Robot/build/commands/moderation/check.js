const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
  Client,
} = require("discord.js");
const Guild = require("../../database/Schemas/Guilds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("🔎 Check a member for punishments or information")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("pick the user to search")
        .setRequired(false)
    ),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async run(client, interaction) {
    const user = interaction.options.getUser("user");

    if (!user) {
    Guild.findOne({ GuildID: interaction.guild.id }, async (err, data) =>  {
      if (data) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Punishment check")
              .setColor("#2F3136")
              .setDescription(
                data.Punishments.map(
                  (w, i) =>
                    `\`\`${i + 1}\`\` - **${w.user}**\nID: ${w.id}\nType: ${w.type}\nReason: ${w.reason}`
                ).join("\n")
              ),
          ],
        });
      }
    });

    } else {

    }


   const punishments = Guild.findOne({ GuildID: interaction.guild.id}, async (err, data) => {

    })

  },
};
