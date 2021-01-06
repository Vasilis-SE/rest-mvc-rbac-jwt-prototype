const UserController = require('../controllers/userController');
const RoutesBase = require('./routesBase');

class UserRoutes extends RoutesBase {
    constructor() {
        super( UserController );
    }

    getRoutes() {
        this.addRoute('/user/*', 'get', 'getUser');
        return this.routes;
    }
    
}

module.exports = UserRoutes;