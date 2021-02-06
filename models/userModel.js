// External modules
const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt');

// Custom modules
const MainModel = require('./mainModel');
const MongoDB = require('../connections/mongo');

class UserModel extends MainModel {
    constructor({_id, name, email, password, role}) {
        super();

        this.setID( _id );
        this.setName( name );
        this.setEmail( email );
        this.setPassword( password );
        this.setRole( role );
    }

    async getUsers(skip=0, limit=process.env.MONGO_QUERY_LIMIT, order={'name': 1}, special={}) {
        try {        
            const query = { ...this.getResource(), ...special };

            console.log(skip, limit, order, query);

            const collection = await MongoDB.usersCollection();
            const users = await collection.find( query ).sort(order).skip(skip).limit( parseInt(limit) ).toArray();

            let userList = [];
            for(let user of users) 
                userList.push( new UserModel( user ) );
            
            return userList;
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

    async comparePlainPassword( plainPass='' ) {
        try {
            return await bcrypt.compare(plainPass, this.getPassword());
        } catch (err) {
            return false;
        }
    }

    // Getters - Setters
    getID() { return this._id; }
    getName() { return this.name; }
    getEmail() { return this.email; }
    getPassword() { return this.password; }
    getRole() { return this.role; }

    setID( id ) { this._id = id ? ObjectID( id ) : null; }
    setName( name ) { this.name = name; }
    setEmail( email ) { this.email = email; }
    setPassword( pass ) { this.password = pass; }
    setRole( role ) { this.role = role; }
}

module.exports = UserModel;