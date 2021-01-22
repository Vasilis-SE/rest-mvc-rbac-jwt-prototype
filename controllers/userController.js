// Custom modules
const mainController = require('./mainController');
// const UserModel = require('../models/userModel');
const UserService = require('../services/userService');
const userValidation = require('../helpers/userValidation');


class UserController extends mainController {

    async getUserById() {
        try {
            console.log(this)

            const userService = new UserService();
            userService.getUser( this.params );


        } catch (err) {
            this.error({'status': false, 'message': err.message});
        }
    }

    async createUser() {
        try {
            // Verify request data
            if(!this.body.name) throw new Error('Missing `name` propery from request...');
            if(!this.body.email) throw new Error('Missing `email` propery from request...');
            if(!this.body.password) throw new Error('Missing `password` propery from request...');
            if(!this.body.role) throw new Error('Missing `role` propery from request...');

            if(this.body.name === '') throw new Error('Property `name` is empty...');
            if(this.body.email === '') throw new Error('Property `email` is empty...');
            if(this.body.password === '') throw new Error('Property `password` is empty...');
            if(this.body.role === '') throw new Error('Property `role` is empty...');

            if(await userValidation.containsSpecialChars(this.body.name)) throw new Error('Property `name` contians invalid characters...');
            if(!await userValidation.isEmailValid(this.body.email)) throw new Error('Property `email` is invalid...');
            if(!await userValidation.passwordContainsName(this.body.password, this.body.name)) throw new Error('Property `password` contains the name...');
            if(!await userValidation.checkMinimumPasswordLength(this.body.password)) throw new Error('Property `password` must have 8 characters in length at least...');
            if(!await userValidation.checkPasswordStrength(this.body.password)) throw new Error('Property `password` is weak! Try using a combination of special charachters, numbers, lower and upercase letters...');
            if(!await userValidation.isUserRoleValid(this.body.role)) throw new Error('Property `role` has invalid value...');

            // Create user instance
            const userModel = new UserModel();
            userModel.setName( this.body.name );
            userModel.setEmail( this.body.email );
            userModel.setPassword( this.body.password );
            userModel.setRole( this.body.role );

            // Encrypt password 
            await userModel.encryptUserPassword();
            
            // Insert new user
            if(!await userModel.createUser()) throw new Error('Could not create new user...');
        
            const resource = await userModel.getResource( userModel );
            this.success({'status': true, 'data': resource});
        } catch (err) {
            this.error({'status': false, 'message': err.message});
        }
    }

}

module.exports = UserController;