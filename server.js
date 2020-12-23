const Express = require('./express');
const Router = require('./routing/router');

const express = new Express(
    new Router([
    ]),
);

express.run();