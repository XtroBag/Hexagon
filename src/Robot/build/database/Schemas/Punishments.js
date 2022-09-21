const mongo = require('mongoose');

const Schema = new mongo.Schema({
    GuildID: String,
    UserID: String,
    UserTag: String,
    Content: Array
})

module.exports = mongo.model('Punishments', Schema);