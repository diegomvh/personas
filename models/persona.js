var mongoose = require('mongoose');

var DomicilioSchema = new mongoose.Schema({
    numero: Number,
    calle: String,
    localidad: String,
    provincia: String,
    descripcion: String,
    location: [ Number ], // lat, lng
    google_address: {
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
    ocupacion: String,
    domicilio_actual: { type: mongoose.Schema.Types.ObjectId, ref: 'Domicilio' },
    domicilios: [{
        fecha: { type: Date, default: Date.now },
        domicilio: { type: mongoose.Schema.Types.ObjectId, ref: 'Domicilio' }
    }]
});

var DomicilioModel = mongoose.model('Domicilio', DomicilioSchema, 'domicilios');
var PersonaModel = mongoose.model('Persona', PersonaSchema, 'personas');

module.exports = PersonaModel
