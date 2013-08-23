var DomicilioModel = require('../models/domicilio');
var logger = require('../utils/logger');

/*
  radius = 10 / 111; // 10km; 1 arcdegree ~= 111km
*/
function getPaises(req, res) {
    var query = DomicilioModel.find({"geoaddress.types": "country"}, "descripcion location");
    query.exec(function (err, paises) {
        if (!err) {
            res.send({
                offset: 0,
                objects: paises,
                total: paises.length
            });
        } else {
            logger.log("error", err);
        }
    });
}

function getProvincias(req, res) {
    var query = DomicilioModel.find({"geoaddress.types": "administrative_area_level_1"}, "descripcion location");
    query.exec(function (err, provincias) {
        if (!err) {
            res.send({
                offset: 0,
                objects: provincias,
                total: provincias.length
            });
        } else {
            logger.log("error", err);
        }
    });
}

function getDepartamentos(req, res) {
    var query = DomicilioModel.find({"geoaddress.types": "administrative_area_level_2"}, "descripcion location");
    query.exec(function (err, departamentos) {
        if (!err) {
            res.send({
                offset: 0,
                objects: departamentos,
                total: departamentos.length
            });
        } else {
            logger.log("error", err);
        }
    });
}

function getLocalidades(req, res) {
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
    this.getPaises = getPaises;
    this.getProvincias = getProvincias;
    this.getDepartamentos = getDepartamentos;
    this.getLocalidades = getLocalidades;
};

module.exports = DomicilioHandler;