// Custom modules
const MainModel = require('./mainModel');
const MongoDB = require('../connections/mongo');
const { ObjectID } = require('mongodb');

class CountryModel extends MainModel {
    constructor({_id, name, language}) {
        super();
        
        this.setID( _id );
        this.setName( name );
        this.setLanguage( language );
    }

    async getCountries(skip=0, limit=process.env.MONGO_QUERY_LIMIT, order={}, special={}) {
        try {
            const query = { ...this.getResource(), ...special };
            const collection = await MongoDB.countriesCollection();
            const countries = await collection.find(query).sort(order).skip(skip).limit( parseInt(limit) ).toArray();

            const countryList = [];
            for(let country of countries) 
                countryList.push( new CountryModel( country ) );
            
            return countryList;
        } catch (err) {
            return false;
        }
    }

    async removeCountries() {
        try {
            const collection = await MongoDB.countriesCollection();
            const result = await collection.deleteMany( this.getResource() );
            if(result.deletedCount === 0) return false;
            return true;
        } catch (err) {
            return false;
        }
    }

    // Getters - Setters
    getID() { return this._id; }
    getName() { return this.name; }
    getLanguage() { return this.language; }

    setID( id ) { this._id = id ? ObjectID(id) : null; }
    setName( name ) { this.name = name; }
    setLanguage( language ) { this.language = language; }
} // End of class

module.exports = CountryModel;