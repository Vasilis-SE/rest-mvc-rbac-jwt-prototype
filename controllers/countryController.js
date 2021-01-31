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
        try {
            const { id } = this.params;
            const countryModel = new CountriesModel();
            countryModel.setID( id );

            const result = await countryModel.removeCountry();
            if(!result) throw new Error('Could not delete country...');

            this.success({'status': true, 'message': 'Successfull deletion!'});
        } catch (err) {
            this.error({'status': false, 'message': err});
        }
    }
}

module.exports = CountriesController;