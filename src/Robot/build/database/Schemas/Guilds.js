const mongo = require('mongoose');

const Schema = new mongo.Schema({
    Name: String,
    GuildID: String,
    OwnerID: String,
    JoinDate: String,
    Settings: Array
})

module.exports = mongo.model('Guilds', Schema);