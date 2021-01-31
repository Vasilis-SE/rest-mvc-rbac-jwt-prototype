const CountriesModel = require('../models/countryModel');

class CountryService {
    #controller = null;

    constructor(c=null) {
        this.#controller = c;
    }

    async getCountries() {

    }


}

module.exports = CountryService;