const CountriesModel = require('../models/countryModel');

class CountryService {
    #controller = null;

    constructor(c=null) {
        this.#controller = c;
    }

    async getCountries() {
        try {
            const country = new CountriesModel(this.#controller.query);
            const result = await country.getCountries();
            if(!result) throw new Error('Could not fetch country list...');
    
            const resources = await Promise.all(result.map(async (countryInst) =>   {
                const resource = await countryInst.getResource();
                return resource;
            }));
    
            return this.#controller.setResponse(200, {'status': true, 'data':resources});    
        } catch (err) {
            return this.#controller.setResponse(500, {'status': false, 'message': err.message});
        }
    }

    getController() { return this.#controller; }
    setController( c ) { this.#controller = c; }
}

module.exports = CountryService;