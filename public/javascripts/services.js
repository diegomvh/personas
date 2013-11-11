'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('Padron.services', []);

services.value('version', '0.1');
