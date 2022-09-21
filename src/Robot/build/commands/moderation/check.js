const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
  Client,
} = require("discord.js");
const Punishment = require("../../database/Schemas/Punishments");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("🔎 Check a member for punishments")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("pick the user to search")
        .setRequired(true)
    ),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async run(client, interaction) {
    const user = interaction.options.getUser("user");

    Punishment.findOne(
      { GuildID: interaction.guild.id, UserID: user.id, UserTag: user.tag },
      async (err, data) => {
        if (err) throw err;
        if (data) {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Punishment check")
                .setColor("#2F3136")
                .setDescription(
                  data.Content.map(
                    (w, i) =>
                      `\`\`${i + 1}\`\` ➜ **${
                        w.MemberName
                      }**\n<:idbadge:1021989396322463815> ID: ${
                        w.MemberID
                      }\n<:user:1021980809713946674> Moderator: ${
                        w.Moderator
                      }\n<:reason:1021980966673186826> Reason: ${
                        w.Reason || "No reason specified"
                      }\n Action: ${
                        w.Action
                      }\n<:time:1021981286669230130> Date: <t:${w.Date}:R>`
                  ).join("\n\n")
                ),
            ],
          });
        } else {
          interaction.reply({ content: "they have no punishments on record" });
        }
      }
    );
  },
};
