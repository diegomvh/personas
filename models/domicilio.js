var mongoose = require('mongoose');

// Localidades
// { "_id" : ObjectId("5208eaa81a90ac75e80ad511"), "descripcion" : "Esquel, Chubut Province, Argentina" }
// { "_id" : ObjectId("5208ebae1a90ac75e80ae447"), "descripcion" : "Puerto Madryn, Chubut Province, Argentina" }
// { "_id" : ObjectId("5208ebcb1a90ac75e80ae5f5"), "descripcion" : "Playa Unión, Chubut Province, Argentina" }
// { "_id" : ObjectId("5208ebcd1a90ac75e80ae637"), "descripcion" : "Comodoro Rivadavia, Chubut Province, Argentina" }
// * { "_id" : ObjectId("5208ef251a90ac75e80b166f"), "descripcion" : "25 de Mayo, Mendoza Province, Argentina" }
// * { "_id" : ObjectId("5208f07c1a90ac75e80b2c05"), "descripcion" : "San Martín, Mendoza Province, Argentina" }
// * { "_id" : ObjectId("5208f36f1a90ac75e80b4ee4"), "descripcion" : "El Carmen Rivero Torres, Bolivia" }
// { "_id" : ObjectId("5208f44e1a90ac75e80b57b3"), "descripcion" : "Don Bosco, Chubut Province, Argentina" }
// * { "_id" : ObjectId("5208f9c31a90ac75e80b7e6e"), "descripcion" : "28680 San Martín, Madrid, Spain" }
// { "_id" : ObjectId("5208eb241a90ac75e80ade6f"), "descripcion" : "Gaiman, Chubut Province, Argentina" }
// { "_id" : ObjectId("5208eb251a90ac75e80ade75"), "descripcion" : "Rawson, Chubut Province, Argentina" }
// { "_id" : ObjectId("5208ebf21a90ac75e80ae877"), "descripcion" : "Trelew, Chubut Province, Argentina" }

var DomicilioSchema = new mongoose.Schema({
    numero: Number,
    calle: String,
    localidad: String,
    departamento: String,
    provincia: String,
    pais: String,
    descripcion: String,
    location: {type: [Number], index: '2d'},
    geoaddress: {
        geometry: {
            location: {
                lat: { type: Number, required:true},
                lng: { type: Number, required:true},
            },
            viewport: {
                northeast: {
                    lat: { type: Number, required:true},
                    lng: { type: Number, required:true},
                },
                southwest: {
                    lat: { type: Number, required:true},
                    lng: { type: Number, required:true},
                }
            },
            location_type: { type: String, required:true},
        },
        address_components: [{
            short_name: { type: String, required:true},
            types: [ String ],
            long_name: String,
        }],
        partial_match: Boolean,
        formatted_address: String,
        types: [ String ],
    }
});

DomicilioSchema.methods.findNear = function(selector, slice) {
    selector.location = { $nearSphere: this.location, $maxDistance: 0.01};
    return this.model('Domicilio').find(selector, slice);
}

var DomicilioModel = mongoose.model('Domicilio', DomicilioSchema, 'domicilios');

module.exports = DomicilioModel
