// Custom modules
const ControllerBase = require('./controllerBase');
const UserModel = require('../models/userModel');
const userValidation = require('../helpers/userValidation');

class UserController extends ControllerBase {

    async getUser() {
        try {
            if(!this.params[0]) throw new Error('Invalid parameters! Missing user id...');

            const userModel = new UserModel();
            userModel.setID( this.params[0] );
           
            const result = await userModel.getUserByID();
            if(!result) throw new Error('Could not fetch user...');

            const resource = await userModel.getResource( userModel );

            this.success({'status': true, 'data': resource});
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

            this.success({'status': true, 'data': resource});
        } catch (err) {
            this.error({'status': false, 'message': err.message});
        }
    }

}

module.exports = UserController;