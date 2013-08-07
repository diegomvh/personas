var config = require("./config-local")

config.logger = {
    "api": "logs/api.log",
    "exception": "logs/exceptions.log"
}

module.exports = config