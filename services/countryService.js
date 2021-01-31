const CountriesModel = require('../models/countryModel');

class CountryService {
    #controller = null;

    constructor(c=null) {
        this.#controller = c;
    }

    async getCountries() {
        try {
            let bindedFilters = {...this.#controller.params, ...this.#controller.query};
            const country = new CountriesModel(bindedFilters);
            const result = await country.getCountries();

            if(!result) throw new Error('Could not fetch country list...');
            if(result.length === 0) throw new Error('Could not find any results with the given criteria...');
    
            const resources = await Promise.all(result.map(async (countryInst) =>   {
                const resource = await countryInst.getResource();
                return resource;
            }));
    
            return this.#controller.setResponse(200, {'status': true, 'data':resources});    
        } catch (err) {
            return this.#controller.setResponse(500, {'status': false, 'message': err.message});
        }
    }

    async deleteCountries() {
        try {
            let bindedFilters = {...this.#controller.params, ...this.#controller.query};
            const country = new CountriesModel(bindedFilters);
            console.log( country );
            const result = await country.removeCountries();

            if(!result) throw new Error('Failed to delete resource...');
            return this.#controller.setResponse(200, {'status': true});    
        } catch (err) {
            return this.#controller.setResponse(500, {'status': false, 'message': err.message});
        }
    }

    getController() { return this.#controller; }
    setController( c ) { this.#controller = c; }
}

module.exports = CountryService;