var PersonaModel = require('../models/persona');
var logger = require('../utils/logger');

function getPersonas(req, res) {
    var query = PersonaModel.find().skip(20).limit(10);
    query.exec(function (err, personas) {
        if (!err) {
            res.send(personas);
        } else {
            logger.log("error", err);
        }
    });
}

function getPersonaById(req, res) {
    PersonaModel.findById(req.params.id, function (err, persona) {
        if (!err) {
            res.send(persona);
        } else {
            logger.log("error", err);
        }
    });
}

function PersonaHandler() {
    this.getPersonas = getPersonas;
    this.getPersonaById = getPersonaById;
};

module.exports = PersonaHandler;