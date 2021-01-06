const UserController = require('../controllers/userController');
const RoutesBase = require('./routesBase');

class UserRoutes extends RoutesBase {
    constructor() {
        super( UserController );
    }

    getRoutes() {
        this.addRoute('/user/*', 'get', 'getUser');
        this.addRoute('/user/create', 'post', 'createUser');
        return this.routes;
    }
    
}

module.exports = UserRoutes;