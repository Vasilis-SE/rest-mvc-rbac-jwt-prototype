// Custom modules
const ControllerBase = require('./controllerBase');
const CountriesModel = require('../models/countryModel');

class CountriesController extends ControllerBase {
    
    async getCountries() {
        console.log('** getCountries **');
        try {
            const model = new CountriesModel();
            const result = await model.getCountries();
            if(!result) throw new Error('Could not fetch country list...');

            const resources = await Promise.all(result.map(async (countryInst) =>   {
                const resource = await countryInst.getResource();
                return resource;
            }));
            
            this.success({'status': true, 'data': resources});
        } catch (err) {
            this.error({'status': false, 'message': err.message});
        }
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