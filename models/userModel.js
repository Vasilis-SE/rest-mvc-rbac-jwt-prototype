// External modules
const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt');

// Custom modules
const ModelBase = require('./modelBase');
const MongoDB = require('../connections/mongo');

class UserModel extends ModelBase {

    // Constructor
    constructor() {
        super();
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

    async getUserByID() {
        try {
            const collection = await MongoDB.usersCollection();
            const user = await collection.find({ _id: ObjectID( this.getID() ) }).toArray();
            
            this.setName( user[0].name );
            this.setRole( user[0].role );
            return true;
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

    // Getters - Setters
    getID() { return this.id; }
    getName() { return this.name; }
    getEmail() { return this.email; }
    getPassword() { return this.password; }
    getRole() { return this.role; }

    setID( id ) { this.id = id; }
    setName( name ) { this.name = name; }
    setEmail( email ) { this.email = email; }
    setPassword( pass ) { this.password = pass; }
    setRole( role ) { this.role = role; }
}

module.exports = UserModel;