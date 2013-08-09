var PersonaModel = require('../models/persona');
var logger = require('../utils/logger');

function getPersonas(req, res) {
    /*
        TODO Validar
    */
    var skip = Number(req.param("skip", 0)),
        limit = Number(req.param("limit", 1000))
    var query = PersonaModel.find().skip(skip).limit(limit);
    query.exec(function (err, personas) {
        if (!err) {
            res.send({
                offset: skip,
                objects: personas,
                total: personas.length
            });
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