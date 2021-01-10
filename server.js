// External modules
const Express = require('./express');

// Custom modules
const Router = require('./routes/router');
const Security = require('./security/security');
const CountryRoutes = require('./routes/countryRoutes');
const UserRoutes = require('./routes/userRoutes');

const routerList = new Router([
    new CountryRoutes(),
    new UserRoutes()
])

const security = new Security(); // Create security instance
const express = new Express(routerList, security);
express.run();