// Custom modules
const ControllerBase = require('./controllerBase');
const UserModel = require('../models/userModel');

class UserController extends ControllerBase {

    async getUser() {
        try {
            // const model = new UserModel();
            // const result = await model.getUserByID();
            // if(!result) throw new Error('Could not fetch country list...');

            // const resources = await Promise.all(result.map(async (countryInst) =>   {
            //     const resource = await countryInst.getResource();
            //     return resource;
            // }));
            
            this.success({'status': true, 'data': resources});
        } catch (err) {
            this.error({'status': false, 'message': err.message});
        }
    }

}

module.exports = UserController;