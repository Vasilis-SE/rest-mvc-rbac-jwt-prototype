// Custom modules
const ControllerBase = require('./controllerBase');
const CountriesModel = require('../models/countryModel');
const MongoDB = require('../connections/mongo');

class CountriesController extends ControllerBase {
    
    async getCountries() {
        try {
            
            console.log(MongoDB);

            const collection = MongoDB.countriesCollection();
            console.log(collection);

            const countries = [
                { _id: 0, name: "Great Britain", language: "en-UK" }, 
                { _id: 1, name: "Greece", language: "el-GR" }, 
                { _id: 2, name: "USA", language: "en-US" }
            ];

            const resources = await Promise.all(countries.map(async (country) =>   {
                const model = new CountriesModel(country);
                const resource = await model.getResource( country );
                return resource;
            }));
            
            this.success(resources);
        } catch (err) {
            this.error(err);
        }
    }

    async getContry() {
        const { id } = this.params;

        try {
            const countryModel = new CountriesModel({ _id: id });
            const resource = await countryModel.getResource(this.uriGenerator);
            this.success(resource);
        } catch (err) {
            this.error(err);
        }
    }

    async removeCountry() {
        try {
            this.nocontent();
        } catch (err) {
            this.error(err);
        }
    }
}

module.exports = CountriesController;