const UserModel = require('../models/userModel');
const userValidation = require('../helpers/userValidation');

class UserService {
    #controller = null;

    constructor(c=null) {
        this.#controller = c;
    }

    async checkUserLogin() {
        try {
            if(!this.#controller.body.username) throw new Error('The username is missing...');
            if(!this.#controller.body.password) throw new Error('The password is missing...');

            const user = new UserModel({name: this.#controller.body.username});
            const userList = await user.getUsers();

            if(!userList) throw new Error('Could not find user with the given credentials...');
            if(!await userList[0].comparePlainPassword( this.#controller.body.password )) throw new Error('Could not find user with the given credentials...');

            return this.#controller.setResponse(200, {'status': true, 'data':userList[0].getResource()});
        } catch (err) {
            return this.#controller.setResponse(500, {'status': false, 'message': err.message});
        }
    }

    async getUserByID() {
        try {
            if(!this.#controller.params[0]) throw new Error('The user`s id is missing...');
            const user = new UserModel({_id:this.#controller.params[0]});            
            const results = await user.getUsers();
            if(!results) throw new Error('Could not find user with the given credentials...');
            return this.#controller.setResponse(200, {'status': true, 'data':results[0].getResource()});
        } catch (err) {
            return this.#controller.setResponse(500, {'status': false, 'message': err.message});
        }
    }

    async createNewUser() {
        try {     
            // Verify request data
            if(!this.#controller.body.name) throw new Error('Missing `name` propery from request...');
            if(!this.#controller.body.email) throw new Error('Missing `email` propery from request...');
            if(!this.#controller.body.password) throw new Error('Missing `password` propery from request...');
            if(!this.#controller.body.role) throw new Error('Missing `role` propery from request...');

            if(this.#controller.body.name === '') throw new Error('Property `name` is empty...');
            if(this.#controller.body.email === '') throw new Error('Property `email` is empty...');
            if(this.#controller.body.password === '') throw new Error('Property `password` is empty...');
            if(this.#controller.body.role === '') throw new Error('Property `role` is empty...');

            if(await userValidation.containsSpecialChars(this.#controller.body.name)) throw new Error('Property `name` contians invalid characters...');
            if(!await userValidation.isEmailValid(this.#controller.body.email)) throw new Error('Property `email` is invalid...');
            if(!await userValidation.passwordContainsName(this.#controller.body.password, this.#controller.body.name)) throw new Error('Property `password` contains the name...');
            if(!await userValidation.checkMinimumPasswordLength(this.#controller.body.password)) throw new Error('Property `password` must have 8 characters in length at least...');
            if(!await userValidation.checkPasswordStrength(this.#controller.body.password)) throw new Error('Property `password` is weak! Try using a combination of special charachters, numbers, lower and upercase letters...');
            if(!await userValidation.isUserRoleValid(this.#controller.body.role)) throw new Error('Property `role` has invalid value...');

            const user = new UserModel({name: this.#controller.body.name});     
            if(await user.userExists()) throw new Error('User already exists...');

            user.setEmail(this.#controller.body.email);
            user.setPassword(this.#controller.body.password);
            user.setRole(this.#controller.body.role);

            await user.encryptUserPassword();
            if(!await user.createUser()) throw new Error('Could not create new user...');

            let resource = user.getResource();
            delete resource.password;
            return this.#controller.setResponse(200, {'status': true, 'data':resource});
        } catch (err) {
            return this.#controller.setResponse(500, {'status': false, 'message': err.message});
        }
    }

    getController() { return this.#controller; }
    setController( c ) { this.#controller = c; }
}

module.exports = UserService;