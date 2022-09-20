const logger = require('../../types/logger')
const glob = require('glob');
const path = require('path')
const chalk = require('chalk');
const { LoggerTypes } = require('../../types/logger-types');


module.exports = (client) => {

    glob(`**/events/*.js`, (err, files) =>{
        for(let i = 0; i < files.length; i++){
            const event = require(`../events/${ path.basename(files[i]) }`)    
            if (event.once) {
                client.once(event.name, (...args) => event.run(...args, client))
            } else {
                client.on(event.name, (...args) => event.run(...args, client))
            }
    
        }

        logger(LoggerTypes.EVENT, "Events have been loaded")
    
    });


}
