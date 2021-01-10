// Custom modules
const MainModel = require('./mainModel');
const MongoDB = require('../connections/mongo');
const { ObjectID } = require('mongodb');

class CountryModel extends MainModel {
    constructor() {
        super();
    }

    async getCountries() {
        try {
            const collection = await MongoDB.countriesCollection();
            const countries = await collection.find({}).toArray();

            const countryList = [];
            for(let country of countries) {
                let tempCountry = new CountryModel();
                tempCountry.setID( country._id );
                tempCountry.setName( country.name );
                tempCountry.setLanguage( country.language );

                countryList.push(tempCountry);
            }
 
            return countryList;
        } catch (err) {
            return false;
        }
    }

    async getCountry() {
        try {
            const collection = await MongoDB.countriesCollection();
            const country = await collection.find({ _id: ObjectID( this.getID() ) }).toArray();
            this.setName( country[0].name );
            this.setLanguage( country[0].language );
            return true;
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

    setID( id ) { this._id = id; }
    setName( name ) { this.name = name; }
    setLanguage( language ) { this.language = language; }
} // End of class

module.exports = CountryModel;