const CountriesModel = require('../models/countryModel');

class CountryService {
    #controller = null;

    constructor(c=null) {
        this.#controller = c;
    }

    async getCountries() {
        try {
            let queryProperties = {...this.#controller.params, ...this.#controller.query};

            // Ordering
            let order = {'name': 1};
            if('asc' in queryProperties) order[ queryProperties['asc'] ] = 1;
            if('desc' in queryProperties) order[ queryProperties['desc'] ] = -1;

            // Pagination
            let page = ('page' in queryProperties) ? parseInt( queryProperties.page ) : 1;
            let limit = ('limit' in queryProperties) ? parseInt( queryProperties.limit ) : process.env.MONGO_QUERY_LIMIT;
            let skip = (page - 1) * limit;

            // Special
            let special = {};
            if('name' in queryProperties) {
                special.name = new RegExp(queryProperties.name, 'i');
                delete queryProperties.name;
            }

            const country = new CountriesModel(queryProperties);
            const result = await country.getCountries(skip, limit, order, special);

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
            let queryProperties = {...this.#controller.params, ...this.#controller.query};
            const country = new CountriesModel(queryProperties);
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