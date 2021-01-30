// Custom modules
const mainController = require('./mainController');
const UserService = require('../services/userService');

class UserController extends mainController {
    async getUserById() {
        const userService = new UserService( this );
        await userService.getUserByID();        
        userService.getController().sendResponse();
    }

    async createUser() {
        const userService = new UserService( this );
        await userService.createNewUser();
        userService.getController().sendResponse();
    }
}

module.exports = UserController;