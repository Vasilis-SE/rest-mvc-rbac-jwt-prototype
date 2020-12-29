const CountryController = require('../controllers/countryController');
const RoutesBase = require('./routesBase');

class ContryRoutes extends RoutesBase {
    constructor() {
        super( CountryController );
    }

    getRoutes() {
        this.addRoute('/countries', 'get', 'getCountries');
        this.addRoute('/countries/:id', 'get', 'getCountryByID');
        this.addRoute('/countries/:id', 'delete', 'removeCountryByID');
        return this.routes;
    }
    
}

module.exports = ContryRoutes;