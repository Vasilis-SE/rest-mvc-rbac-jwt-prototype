const UserModel = require('../models/userModel');

class UserService {
    #controller = null;

    constructor(c=null) {
        this.#controller = c;
    }

    async checkUserLogin() {
        try {
            if(!this.getController().body.username) throw new Error('The username is missing...');
            if(!this.getController().body.password) throw new Error('The password is missing...');

            const user = new UserModel({name: this.getController().body.username});
            const userList = await user.getUsers();

            if(!userList) throw new Error('Could not find user with the given credentials...');
            if(!await userList[0].comparePlainPassword( this.getController().body.password )) throw new Error('Could not find user with the given credentials...');

            return this.getController().setResponse(200, {'status': true, 'data':userList[0].getResource()});
        } catch (err) {
            return this.getController().setResponse(500, {'status': false, 'message': err.message});
        }
    }

    async getUserByID() {
        try {
            if(!this.getController().params[0]) throw new Error('The user`s id is missing...');
            const user = new UserModel({_id:this.getController().params[0]});            
            const results = await user.getUsers();
            if(!results) throw new Error('Could not find user with the given credentials...');
            return this.getController().setResponse(200, {'status': true, 'data':results[0].getResource()});
        } catch (err) {
            return this.getController().setResponse(500, {'status': false, 'message': err.message});
        }
    }







    async getUsers() {
        try {
            
        } catch (err) {
            this.error({'status': false, 'message': err.message});
        }
    }

    getController() { return this.#controller; }
    setController( c ) { this.#controller = c; }
}

module.exports = UserService;