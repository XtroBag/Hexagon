require("dotenv").config();
const { token, clientID } = process.env;
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const readdir = require("fs").promises.readdir;
const logger = require("../../types/logger");
const { LoggerTypes } = require('../../types/logger-types')

module.exports = async (client) => {
  const folders = await readdir(`./build/commands`);
  const filesPerFolder = await Promise.all(
    folders.map((folder) => readdir(`./build/commands/${folder}`))
  );
  const jsFilesPerFolder = filesPerFolder.map((files) =>
    files.filter((file) => file.endsWith(`.js`))
  );
  const commandsArray = jsFilesPerFolder.map((files, i) =>
  files.map((file) => {
    const cmd =
      require(`../../build/commands/${folders[i]}/${file}`);
      client.slashCommands.set(cmd.data.toJSON().name, cmd);
    return cmd.data.toJSON();
  })
);
  const rest = new REST({ version: `9` }).setToken(token);
  try {
    await rest.put(Routes.applicationCommands(clientID), {
      body: commandsArray.flat()
    });
  } catch (err) {
    console.error(err);
  }

  logger(LoggerTypes.LOAD, "Commands have been loaded")
};
