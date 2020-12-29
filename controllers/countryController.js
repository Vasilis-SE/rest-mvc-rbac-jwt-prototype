// Custom modules
const ControllerBase = require('./controllerBase');
const CountriesModel = require('../models/countryModel');
const MongoDB = require('../connections/mongo');
const { ObjectID } = require('mongodb');
class CountriesController extends ControllerBase {
    
    async getCountries() {
        try {
            const collection = await MongoDB.countriesCollection();
            const countries = await collection.find({}).toArray();

            const resources = await Promise.all(countries.map(async (country) =>   {
                const model = new CountriesModel(country);
                const resource = await model.getResource( country );
                return resource;
            }));
            
            this.success({'status': true, 'data': resource});
        } catch (err) {
            this.error({'status': false, 'message': err});
        }
    }

    async getCountryByID() {
        try {
            const { id } = this.params;

            const collection = await MongoDB.countriesCollection();
            const country = await collection.find({ _id: ObjectID(id) }).toArray();

            const countryModel = new CountriesModel({ _id: id });
            const resource = await countryModel.getResource( country );
            this.success({'status': true, 'data': resource});
        } catch (err) {
            this.error({'status': false, 'message': err});
        }
    }

    async removeCountryByID() {
        try {
            const { id } = this.params;

            const collection = await MongoDB.countriesCollection();
            const result = await collection.deleteOne({ _id: ObjectID(id) });
            
            if(result.deletedCount !== 1) {
                this.error();
            }

            this.success({'status': true, 'message': 'Successfull deletion!'});
        } catch (err) {
            this.error({'status': false, 'message': err});
        }
    }
}

module.exports = CountriesController;