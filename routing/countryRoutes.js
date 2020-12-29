const CountryController = require('../controllers/countryController');
const RoutesBase = require('./routesBase');

class ContryRoutes extends RoutesBase {
    constructor() {
        super( CountryController );
    }

    getRoutes() {
        this.addRoute('/countries', 'get', 'getCountries');
        return this.routes;
    }
    
}

module.exports = ContryRoutes;