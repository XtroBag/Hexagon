const logger = require("../../types/logger");
const chalk = require("chalk");
const Schema = require("../database/Schemas/Guilds");

module.exports = {
  name: "guildCreate",

  run(guild, client) {

    /*
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    var hours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var fullDate = date + " " + hours;

    Schema.findOne({ GuildID: guild.id }, async (err, data) => {
      if (data) {
        console.log(`This server's name is: ${data["Name"]}!`);
      } else {
        new Schema({
          Name: guild.name,
          GuildID: guild.id,
          OwnerID: guild.ownerId,
          JoinDate: fullDate,
        }).save();

        console.log(
          `Woah! This server doesn't have a database file set i just made one!`
        );
      }
    });
    */
  },
};
