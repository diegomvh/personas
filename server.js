var express = require("express"),
    path = require("path"),
    mongoose = require('mongoose'),
    routes = require('./routes'),
    fs = require('fs');

// Log file
var expressLogFile = fs.createWriteStream('./logs/express.log', {flags: 'a'}); 

// Application
var app = express();
app.configure(function () {
    app.set('view engine', 'jade');
    app.use(express.logger({stream: expressLogFile}));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, "public")));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});

var PersonaHandler = require('./handlers/persona');

var handlers = {
  persona: new PersonaHandler(),
};

function start() {
    routes.setup(app, handlers);
    var port = process.env.PORT || 3000;
    app.listen(port);
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
}

// *******************************************************
exports.start = start;
exports.app = app;
