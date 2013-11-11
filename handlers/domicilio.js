var DomicilioModel = require('../models/domicilio');
var logger = require('../utils/logger');

/*
  radius = 10 / 111; // 10km; 1 arcdegree ~= 111km
*/
function getPaises(req, res) {
    var query = DomicilioModel.find({"geoaddress.types": "country"}, "descripcion location types");
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
    var query = DomicilioModel.find({"geoaddress.types": "administrative_area_level_1"}, "descripcion location types");
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
    var query = DomicilioModel.find({"geoaddress.types": "administrative_area_level_2"}, "descripcion location types");
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
    var query = DomicilioModel.find({"geoaddress.types": "locality"}, "descripcion location types");
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

function getDomicilios(req, res) {
    var skip = Number(req.param("skip")) || 0,
        limit = Number(req.param("limit")) || 1000,
        bounds = req.param("bounds"),
        center = req.param("center");
    var center = center.split(',');
    center = [ Number(center[0]), Number(center[1]) ];
    console.log(bounds, center);
    var lugar = DomicilioModel({location: center})
    var query = lugar.findNear({
        "geoaddress.types": "street_address",

        }, "_id descripcion location types");
    if (skip)
        query.skip(skip);
    if (limit)
        query.limit(limit);
    query.exec(function (err, domicilios) {
        if (!err) {
            res.send({
                offset: 0,
                objects: domicilios,
                total: domicilios.length
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
    this.getDomicilios = getDomicilios;
};

module.exports = DomicilioHandler;