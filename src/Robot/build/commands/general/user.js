const {
  EmbedBuilder,
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  ActivityType,
  codeBlock,
  UserFlagsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("return user information")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("the user to check information about")
        .setRequired(true)
    ),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async run(client, interaction) {
    const member = interaction.options.getMember("user");
    const user = await interaction.options.getUser("user").fetch(true);

    if (user.bot) {
      return interaction.reply({ content: "Please mention a user not a bot." });
    }

    let boosted;
    if (member.premiumSinceTimestamp) {
      boosted = `<t:${parseInt(member.premiumSinceTimestamp / 1000)}:R>`;
    } else {
      boosted = "``Never boosted``";
    }

    let status = {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline",
    };

    const flags = (await user.fetchFlags(true)).toArray();
    const badges = [];

    if (flags.length === 0) {
      badges.push("``No badges``");
    }

    for (let index = 0; index < flags.length; index++) {
      const item = flags[index];
      switch (item) {
        case "HypeSquadOnlineHouse1":
          badges.push("<:BraveryBadge:1024781068047491092>");
          break;
        case "HypeSquadOnlineHouse2":
          badges.push("<:BrillianceBadge:1024782413026562098>");
          break;
        case "HypeSquadOnlineHouse3":
          badges.push("<:BalanceBadge:1024781972201033840>");
          break;
      }
    }

    let nitro;
    if (member.premiumSince) {
      nitro = "<:NitroBadge:1024780628744486912>";
    } else {
      nitro = "";
    }

    let banner;
    if (user.bannerURL()) {
      banner = `[Banner](${user.bannerURL()})`;
    } else {
      banner = "No banner";
    }

    const embed = new EmbedBuilder()
      .setTitle("User Information")
      .setDescription(`Welcome to ${member.user.username}'s profile!`)
      .setThumbnail(member.displayAvatarURL())
      .addFields(
        {
          name: "General Information:",
          value: `
        <:ID:1024448849122689035> ID: \`\`${member.id}\`\`
        <:Status:1024531146249338920> Status:  \`\`${
          status[member.presence?.status ?? "offline"]
        }\`\`
        <:Discriminator:1024547427048493066> Discriminator: \`\`#${
          user.discriminator
        }\`\`
        <:Badges:1024760043993837779> Badges: ${badges} ${nitro}
        `,
        },
        {
          name: "Server Information:",
          value: `
        <:JoinedServer:1024526949948866580> Joined Server: <t:${parseInt(
          member.joinedTimestamp / 1000
        )}:R>
        <:AccountCreated:1024527711592521758> Account Created: <t:${parseInt(
          user.createdTimestamp / 1000
        )}:R>
        <:Boosting:1024550775034216489> Boosted: ${boosted}
        <:Nickname:1024530074155888691> Nickname: \`\`${
          member.nickname || "Default"
        }\`\`
        <:Color:1024475227742281770> Banner: ${banner}
        `,
          inline: true,
        },
        {
          name: "Roles:",
          value:
            member.roles.cache
              .toJSON()
              .filter((role) => role.id !== interaction.guild.id).length === 0
              ? codeBlock("yaml", "No roles")
              : member.roles.cache
                  .toJSON()
                  .filter((role) => role.id !== interaction.guild.id)
                  .sort((a, b) => b.position - a.position)
                  .slice(0, 3 * 4)
                  .map((val, idx) => {
                    return `${val}${(idx + 1) % 3 === 0 ? "\n" : ""}`;
                  })
                  .join(" ")
                  .split("\n,")
                  .join("\n")
                  .concat(
                    member.roles.cache.toJSON().length <= 9
                      ? ""
                      : "__There are too many roles to list more__"
                  ),
          inline: false,
        },
        {
          name: "Activities",
          value: codeBlock(
            "fix",
            `${
              member.presence?.activities
                .map(
                  (activity) => `${activity.name}` // ${ActivityType[activity.type]}
                )
                .join("\n") || "No activities"
            } `
          ),
          inline: false,
        }
      )
      .setColor("#2F3136")
      .setFooter({ text: `${member.user.tag}` })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};