const Express = require('./express');
const Router = require('./routing/router');
const CountryRoutesBuilder = require('./routing/countryRoutes');

// Connections
const MongoDB = require('./connections/mongo');
MongoDB.init();

const express = new Express(
    new Router([
        new CountryRoutesBuilder()
    ])
);

express.run();