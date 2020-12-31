// External modules
const Express = require('./express');

// Custom modules
const Router = require('./routing/router');
const CountryRoutesBuilder = require('./routing/countryRoutes');
const Security = require('./security/security');

const routersList = new Router([
    new CountryRoutesBuilder()
])

const security = new Security(); // Create security instance
const express = new Express(routersList, security);
express.run();