var mongoose = require('mongoose');

var DomicilioSchema = new mongoose.Schema({
    localidad: String,
    descripcion: String,
    provincia: String
});

var PersonaSchema = new mongoose.Schema({ 
    documento: { type: Number, required:true},
    tipo_documento: String,
    nombre_completo: String,
    clase: Number,
    sexo: String,
    nacimiento: { type: Date },
    nombres: String,
    apellidos: String,
    ocupacion: String,
    domicilio: { type: mongoose.Schema.Types.ObjectId, ref: 'Domicilio' },
    domicilios: [{
        fecha: { type: Date, default: Date.now },
        domicilio: { type: mongoose.Schema.Types.ObjectId, ref: 'Domicilio' }
    }]
});

var DomicilioModel = mongoose.model('Domicilio', DomicilioSchema, 'domicilios');
var PersonaModel = mongoose.model('Persona', PersonaSchema, 'personas');

module.exports = PersonaModel
