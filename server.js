// External modules
const Express = require('./express');

// Custom modules
const Router = require('./routing/router');
const Security = require('./security/security');
const CountryRoutes = require('./routing/countryRoutes');
const UserRoutes = require('./routing/userRoutes');

const routersList = new Router([
    new CountryRoutes(),
    new UserRoutes()
])

const security = new Security(); // Create security instance
const express = new Express(routersList, security);
express.run();