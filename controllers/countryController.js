// Custom modules
const mainController = require('./mainController');
const CountryService = require('../services/countryService');
const c = require('config');

class CountriesController extends mainController {
    async getCountries() {
        const countryService = new CountryService( this );
        await countryService.getCountries();
        countryService.getController().sendResponse();
    }

    async removeCountryByID() {
        const countryService = new CountryService( this );
        await countryService.deleteCountries();
        countryService.getController().sendResponse();
    }
}

module.exports = CountriesController;