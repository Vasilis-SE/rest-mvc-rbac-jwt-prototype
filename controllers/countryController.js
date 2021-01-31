// Custom modules
const mainController = require('./mainController');
const CountryService = require('../services/countryService');

class CountriesController extends mainController {
    
    async getCountries() {
        const countryService = new CountryService( this );
        await countryService.getCountries();
        countryService.getController().sendResponse();
    }

    async getCountryByID() {
        try {
            const { id } = this.params;
            const countryModel = new CountriesModel();
            countryModel.setID( id );

            const result = await countryModel.getCountry();
            if(!result) throw new Error('Could not fetch country...');

            const resource = await countryModel.getResource( countryModel );
            this.success({'status': true, 'data': resource});
        } catch (err) {
            this.error({'status': false, 'message': err.message});
        }
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