require("dotenv").config();
const { token, clientID, mongo } = process.env;
const fs = require("fs");
const { connect } = require("mongoose");
const logger = require("./types/logger");
const { LoggerTypes } = require("./types/logger-types");
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ActivityType,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences
  ],
  allowedMentions: { parse: ["users"] },
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
  ],
  presence: {
    activities: [
      {
        name: `Xtrobag`,
        type: ActivityType.Listening,
      },
    ],
  },
});

connect(mongo, {}).then(() => logger(LoggerTypes.DATABASE, "Schemas have been uploaded and ready"));

(async () => {
  // Slash commands
  client.slashCommands = new Collection();

  // Slash commands loading
  await require("./build/handler/command")(client);

  // loads the events
  require("./build/handler/event")(client);

  // Logs in
  client.login(process.env.token);
})();
