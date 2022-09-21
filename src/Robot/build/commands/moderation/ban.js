const {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const Punishment = require("../../database/Schemas/Punishments");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Remove users from your guild that cause problems")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("🔨 Ban a user from your server")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to ban from the server [ID/USER]")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("The reason to ban this user")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("🔨 Unban a user from your server")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to unban from the server [ID/USER]")
            .setRequired(true)
        )
    ),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async run(client, interaction) {
    const sub = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString("reason") ?? "No reason specified";

    const { guild } = interaction;

    if (sub === "add") {
      if (interaction.user.id === user.id) {
        return interaction.reply({ content: "You cannot ban yourself" });
      }

      if (user.id === client.user.id) {
        return interaction.reply({ content: "You cannot ban the bot" });
      }

      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.BanMembers
        )
      ) {
        return interaction.reply({ content: "You cannot use this command" });
      }

      if (
        interaction.guild.members.me.permissions.has(
          PermissionFlagsBits.BanMembers
        )
      ) {
        return interaction.reply({
          content: "I do not have permissions to ban this user",
        });
      }

      Punishment.findOne(
        { GuildID: interaction.guild.id, UserID: user.id, UserTag: user.tag },
        async (err, data) => {
          if (err) throw err;
          if (!data) {
            data = new Punishment({
              GuildID: interaction.guild.id,
              UserID: user.id,
              UserTag: user.tag,
              Content: [
                {
                  MemberID: user.id,
                  MemberName: user.tag,
                  Moderator: interaction.user.username,
                  Reason: reason || "No reason specified",
                  Action: "Ban",
                  Date: `${parseInt(interaction.createdTimestamp / 1000)}`,
                },
              ],
            });
          } else {
            const obj = {
              MemberID: user.id,
              MemberName: user.tag,
              Moderator: interaction.user.username,
              Reason: reason || "No reason specified",
              Action: "Ban",
              Date: `${parseInt(interaction.createdTimestamp / 1000)}`,
            };
            data.Content.push(obj);
          }
          data.save();
        }
      );

      const BanEmbed = new EmbedBuilder()
        .setTitle("Member banned")
        .setDescription(
          `Banned: ${user.id}\n Reason: ${reason || "No reason specified"}`
        );

      interaction.reply({ embeds: [BanEmbed] }).then(() => {
        guild.members.ban(user, { reason: reason });
      });
    } else if (sub === "remove") {
    }
  },
};
