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
                .setDescription(`Checking all the punishments of the user ${user.username}`)
                .addFields(data.Content.slice(0, 6).map((item, idx) => {
                    return {
                      name: `Incident ${idx + 1}`,
                      value: [ `\`\`${item.MemberID}\`\``, `<:User:1022185112756035634> ${item.MemberName}`, `<:Moderator:1022184600044326983> ${item.Moderator}`, `<:Reason:1022185519876145172> ${item.Reason}`, `<:Action:1022185753364660275> ${item.Action}`, `<:Time:1022186083288633445> <t:${item.Date}:R>`].join('\n'),
                      inline: true
                    };
                  })
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


// maybe stop pages after is user has more then 24 punishments 
// might need to make sure reason is under amount of characters like 20+ or so