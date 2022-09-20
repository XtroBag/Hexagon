const chalk = require("chalk")
const moment = require("moment");
const { LoggerTypes } = require('../types/logger-types');
  
module.exports = (type, msg) => {
    /**
     * Cool logger thingy
     * @param {string} type - basically the first things in the [] before the log
     * @param {string} msg - the actual thing that is being logged
     */
    const loggedType = type.toLocaleUpperCase()
    if (!type) type = 'Null'
    switch (type) {
        case LoggerTypes.LOAD: // [LOAD]
            return console.log(`[` + chalk.magenta(`${loggedType}`) + `]` + ' ' + chalk.white`${msg}`);
        case LoggerTypes.EVENT: // [EVENT]
            return console.log(`[` + chalk.yellow(`${loggedType}`) + `]` + ' ' + chalk.white`${msg}`);
        case LoggerTypes.DEBUG: // [DEBUG]
            return console.log(`[` + chalk.yellow(`${loggedType}`) + `]` + ' ' + chalk.white`${msg}`)
        case LoggerTypes.ERROR: // [ERROR]
            return console.log(`[` + chalk.red(`${loggedType}`) + `]` + ' ' + chalk.white`${msg}`)
        case LoggerTypes.DATABASE: // [MONGODB]
            return console.log(`[` + chalk.green(`${loggedType}`) + `]` + ' ' + chalk.white`${msg}`)
        default: // [SOMETHING ELSE]
            return console.log(`[` + chalk.blue(`${loggedType}`) + `]` + ' ' + chalk.white`${msg}`);

    }
    

}
