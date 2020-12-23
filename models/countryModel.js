const ModelBase = require('./modelBase');

class CountryModel extends ModelBase {
    constructor(data) {
        super();

        this._id = data._id;
        this.name = data._id;
        this.language = data.language;
    }

    async getCountries() {

    }

    async getCountry() {
        
    }

} // End of class