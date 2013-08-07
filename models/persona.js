var mongoose = require('mongoose');

var PersonaSchema = new mongoose.Schema({ 
    documento: { type: Number, required:true},
    tipo_documento: String,
    nombre_completo: String,
    clase: Number,
    nacimiento: { type: Date },
    sexo: String,
    nombres: String,
    apellidos: String,
    ocupacion: String,
    partido: String
});

var PersonaModel = mongoose.model('Persona', PersonaSchema, 'personas');

module.exports = PersonaModel
