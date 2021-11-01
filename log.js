const logger = require('node-color-log');

module.exports = {
    warn: msg => logger.color('yellow').log(msg),
    error: msg => logger.color('red').log(msg),
    success: msg => logger.color('green').log(msg),
    info: msg => console.log(msg)
};
