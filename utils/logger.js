var winston = require('winston');

function log(level, message) {
    winston.log(level, message);
}

module.exports.log = log;