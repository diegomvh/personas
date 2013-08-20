var DomicilioModel = require('../models/domicilio');
var logger = require('../utils/logger');

function getLocalidades(req, res) {
    /*
        TODO Validar, injection
    */
    var query = DomicilioModel.find({"geoaddress.types": "locality"}, "descripcion location");
    query.exec(function (err, localidades) {
        if (!err) {
            res.send({
                offset: 0,
                objects: localidades,
                total: localidades.length
            });
        } else {
            logger.log("error", err);
        }
    });
}

function DomicilioHandler() {
    this.getLocalidades = getLocalidades;
};

module.exports = DomicilioHandler;