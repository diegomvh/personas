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
    app.get('/api/geo/paises', handlers.domicilio.getPaises);
    app.get('/api/geo/provincias', handlers.domicilio.getProvincias);
    app.get('/api/geo/departamentos', handlers.domicilio.getDepartamentos);
    app.get('/api/geo/localidades', handlers.domicilio.getLocalidades);
    app.get('/api/geo/domicilios', handlers.domicilio.getDomicilios);
    app.get('/api/geo/:id', handlers.domicilio.getDomicilioById);
    app.get('/api/personas', handlers.persona.getPersonas);
    app.get('/api/personas/:id', handlers.persona.getPersonaById);
}

exports.setup = setup;