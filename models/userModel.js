// External modules
const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt');

// Custom modules
const MainModel = require('./mainModel');
const MongoDB = require('../connections/mongo');

class UserModel extends MainModel {
    constructor() {
        super();
    }

    async getUsers() {
        try {
            const collection = await MongoDB.usersCollection();
            const user = await collection.find( this.getResource() ).toArray();
            
            this.setName( user[0].name );
            this.setRole( user[0].role );
            this.setPassword( user[0].password );
            return true;
        } catch (err) {
            return false;
        }
    }

    async userExists() {
        try {
            const collection = await MongoDB.usersCollection();
            const result = await collection.findOne( this.getResource() );
            if(!result) throw new Error();

            return result._id;
        } catch (err) {
            return false;
        }
    }

    async createUser() {
        try {
            const collection = await MongoDB.usersCollection();
            const result = await collection.insertOne( this.getResource() );
            return result.insertedCount === 1 ? true : false;
        } catch (err) {
            return false;
        }
    }

    async encryptUserPassword() {
        try {
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(this.getPassword(), salt);
            this.setPassword( hash );
            return true;
        } catch (err) {
            return false;
        }
    }

    async checkLoginCredentials( plainPass='' ) {
        try {
            return await bcrypt.compare(plainPass, this.getPassword());
        } catch (err) {
            return false;
        }
    }

    // Getters - Setters
    getID() { return this.id; }
    getName() { return this.name; }
    getEmail() { return this.email; }
    getPassword() { return this.password; }
    getRole() { return this.role; }

    setID( id ) { this.id = ObjectID( id ); }
    setName( name ) { this.name = name; }
    setEmail( email ) { this.email = email; }
    setPassword( pass ) { this.password = pass; }
    setRole( role ) { this.role = role; }
}

module.exports = UserModel;