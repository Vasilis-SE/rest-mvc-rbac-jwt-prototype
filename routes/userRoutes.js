const UserController = require('../controllers/userController');
const MainRoutes = require('./mainRoutes');

class UserRoutes extends MainRoutes {
    constructor() {
        super( UserController );
    }

    getRoutes() {
        this.addRoute('/user/:_id', 'get', 'getUsers');
        this.addRoute('/user', 'get', 'getUsers');
        this.addRoute('/user/create', 'post', 'createUser');
        return this.routes;
    }
    
}

module.exports = UserRoutes;