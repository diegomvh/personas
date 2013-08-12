var mongoose = require('mongoose');

var DomicilioSchema = new mongoose.Schema({
    numero: Number,
    calle: String,
    localidad: String,
    departamento: String,
    provincia: String,
    pais: String,
    descripcion: String,
    location: [ Number ], // lat, lng
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

var PersonaSchema = new mongoose.Schema({ 
    documento: { type: Number, required:true},
    tipo_documento: String,
    nombres: String,
    apellidos: String,
    nombre_completo: String,
    clase: Number,
    sexo: String,
    nacimiento: { type: Date },
    actualizado: { type: Date },
    ocupacion: String,
    domicilio: { 
        numero: { type: Number },
        calle: { type: String },
        localidad: { type: String },
        departamento: { type: String },
        provincia: { type: String },
        pais: { type: String },
        descripcion: { type: String },
        location: [ Number ], // lat, lng 
    },
    domicilios: [{
        fecha: { type: Date, default: Date.now },
        domicilio: { type: mongoose.Schema.Types.ObjectId, ref: 'Domicilio' }
    }]
});

var DomicilioModel = mongoose.model('Domicilio', DomicilioSchema, 'domicilios');
var PersonaModel = mongoose.model('Persona', PersonaSchema, 'personas');

module.exports = PersonaModel
