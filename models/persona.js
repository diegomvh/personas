var mongoose = require('mongoose');

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

var PersonaModel = mongoose.model('Persona', PersonaSchema, 'personas');

module.exports = PersonaModel
