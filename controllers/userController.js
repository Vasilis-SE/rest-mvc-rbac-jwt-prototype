// Custom modules
const ControllerBase = require('./controllerBase');
const UserModel = require('../models/userModel');

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

}

module.exports = UserController;