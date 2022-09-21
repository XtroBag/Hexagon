const {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const Guild = require("../../database/Schemas/Guilds");

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
          option
          .setName("reason")
          .setDescription("The reason to ban this user")
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
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

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

      const banEmbed = new EmbedBuilder()
        .setTitle("Member Banned")
        .setDescription(
          `
             **${user.tag} was banned!**
             Reason: ${reason || "No reason provided"}
             `
        )
        .setTimestamp();
      /*
      interaction.reply({ embeds: [banEmbed] }).then(() => {
        guild.members.ban(user, { reason: reason });
      });
*/

      // get the time for the datebase timestamp
      var dt = new Date();
      var h = dt.getHours(),
        m = dt.getMinutes();
      var time;
      if (h == 12) {
        time = h + ":" + m + " PM";
      } else {
        time = h > 12 ? h - 12 + ":" + m + " PM" : h + ":" + m + " AM";
      }

      // get the date for the database timestamp
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      await Guild.findOneAndUpdate(
        {
          GuildID: interaction.guild.id,
        },
        {
          $push: {
            Punishments: {
              user: user.tag,
              id: user.id,
              type: "Ban",
              reason: reason || "No reason provided",
              time: time,
              date: `${day}/${month}/${year}`,
            },
          },
        }
      );
    } else if (sub === "remove") {
    }
  },
};
