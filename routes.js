function index(req, res) {
    res.render('index', { title : 'Home' });
}

function name(req, res) {
    res.json({
        name: 'Personas'
    });
}

function setup(app, handlers) {
    app.get('/', index);
    app.get('/name', name);
    app.get('/api/paises', handlers.domicilio.getPaises);
    app.get('/api/provincias', handlers.domicilio.getProvincias);
    app.get('/api/departamentos', handlers.domicilio.getDepartamentos);
    app.get('/api/localidades', handlers.domicilio.getLocalidades);
    app.get('/api/personas', handlers.persona.getPersonas);
    app.get('/api/personas/:id', handlers.persona.getPersonaById);
}

exports.setup = setup;