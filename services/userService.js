const UserModel = require('../models/userModel');

class UserService {
    #controller = null;

    constructor(c=null) {
        this.#controller = c;
    }

    async checkUserLogin() {
        try {
            if(!this.#controller.body.username) throw new Error('The username is missing...');
            if(!this.#controller.body.password) throw new Error('The password is missing...');

            const user = new UserModel();
            user.setName( this.#controller.body.username );
            user.setPassword( this.#controller.body.password );

            if(!await user.getUsers()) throw new Error('Could not find user with the given credentials...');
            if(!await user.checkLoginCredentials( this.#controller.body.password )) throw new Error('Could not find user with the given credentials...');

            return this.#controller.setResponse(200, {'status': true});
        } catch (err) {
            return this.#controller.setResponse(500, {'status': true});
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