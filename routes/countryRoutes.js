// Custom modules
const MainRoutes = require('./mainRoutes');
const CountryController = require('../controllers/countryController');

class ContryRoutes extends MainRoutes {
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