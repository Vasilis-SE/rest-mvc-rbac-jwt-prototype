const Express = require('./express');
const Router = require('./routing/router');
const CountryRoutesBuilder = require('./routing/routes/countryRoutes');

const express = new Express(
    new Router([
        new CountryRoutesBuilder()
    ]),
);

express.run();