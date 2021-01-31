// Custom modules
const MainModel = require('./mainModel');
const MongoDB = require('../connections/mongo');
const { ObjectID } = require('mongodb');

class CountryModel extends MainModel {
    constructor({_id, name, language}) {
        super();

        this._id = _id ? ObjectID(_id) : null;
        this.name = name;
        this.language = language;
    }

    async getCountries() {
        try {
            const collection = await MongoDB.countriesCollection();
            const countries = await collection.find( this.getResource() ).toArray();

            const countryList = [];
            for(let country of countries) 
                countryList.push( new CountryModel( country ) );
            
            return countryList;
        } catch (err) {
            return false;
        }
    }

    async removeCountry() {
        try {
            const collection = await MongoDB.countriesCollection();
            const result = await collection.deleteOne({ _id: ObjectID(id) });
            if(result.deletedCount !== 1) return false;
            
            return true;
        } catch (err) {
            return false;
        }
    }

    // Getters - Setters
    getID() { return this._id; }
    getName() { return this.name; }
    getLanguage() { return this.language; }

    setID( id ) { this._id = ObjectID(id); }
    setName( name ) { this.name = name; }
    setLanguage( language ) { this.language = language; }
} // End of class

module.exports = CountryModel;