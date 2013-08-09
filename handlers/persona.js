var PersonaModel = require('../models/persona');
var logger = require('../utils/logger');

// GET     /collection     Returns all records. You can give limit and offset parameters to paginate records.
// GET     /collection/:id     Returns a single document
// POST     /collection     Creates a new document
// PUT     /collection/:id     Replaces an existing document
// PATCH     /collection/:id     Updates a document
// DELETE     /collection/:id     Removes an existing document
// 
// selector
//     A Mongo query expression specifying which items to return.
//     Examples:
//         {"fruit":"apple","colour":"green"} (all items where 'fruit' is 'apple' and 'colour' is 'green')
//         {"fruit":{"$exists":true}} (all items that have a 'fruit' property)
//         Example Request:
//             GET http://drowsy.example.com/fridge/crisper?selector={"fruit":{"$exists":true}}
// 
// sort
//     An array of property-order pairs to sort on.
//     Examples:
//         ["fruit","DESC"] (sort by the 'fruit' property, in descending order)
//         ["fruit","ASC"] (sort by the 'fruit' property, in ascending order)
//         [["fruit","ASC"],["colour","DESC"]] (sort by the 'fruit' property first in ascending order and then by the 'colour' property in descending order)
//         Example Request:
//             GET http://drowsy.example.com/fridge/crisper?sort=[["fruit","ASC"],["colour","DESC"]]

function getPersonas(req, res) {
    /*
        TODO Validar, injection
    */
    var skip = Number(req.param("skip")) || 0,
        limit = Number(req.param("limit")) || 1000,
        selector = eval("(" + req.param("selector", "{}") + ")"),
        sort = eval("(" + req.param("sort", "[]") + ")");
    var query = PersonaModel.find(selector);
    //if (sort)
    //    query.sort(sort);
    if (skip)
        query.skip(skip);
    if (limit)
        query.limit(limit);
    console.log(query)
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