// External modules
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { BasicStrategy } = require('passport-http');
const { Strategy: JwtStrategy } = require('passport-jwt');

// Custom modules
const { ExtractJwt } = require('passport-jwt');
const RBAC = require('./rbac');

const MainController = require('../controllers/mainController');
const UserService = require('../services/userService');

class Security {
    constructor() {
        this.rbac = new RBAC();

        // Initialize strategies
        passport.use(new BasicStrategy( this.basicStrategy ));
        passport.use(new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
            ignoreExpiration: false
        }, this.jwtStrategy));
    }

    async basicStrategy(username, password, done) {
        try { 
            const userService = new UserService( new MainController({'params': {username, password}}) );
            await userService.checkUserLogin();
            if(!userService.getController().response.status) throw new Error('Could not find user with the given credentials...');
            done(null, userService.getController().response.data);
        } catch(err) {
            done(err);
        }
    }

    async jwtStrategy(user, done) {
        try {  
            const userService = new UserService( new MainController({'params': {'_id': user._id}}) ); 
            await userService.getUsers();
            
            if(!userService.getController().response.status) throw new Error('Could not initialize user...');
            let userInstance = userService.getController().response.data[0];

            done(null, userInstance);
        } catch(err) {
            done(err);
        }
    }

    generateToken() {
        let jwtGenOptions = { session: false, failWithError: true };

        return [
            passport.authenticate('basic', jwtGenOptions), 
            async (req, res) => {
                let { user } = req;

                let token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                    expiresIn:  14400 // 14400 sec / 4 hours
                });
                
                res.status(200).send({'status': true, 'token': token});
            }, (err, req, res) => {
                return res.status(401).send({ 'status':false, 'error_code':'GEN_TOKEN', 'message':'Could not generate token...' })
            }
        ];
    }

    authenticate() {        
        return [
            passport.authenticate('jwt', { session: false, failWithError: true }), 
            (req, res, next) => {
                if (!req.user) req.user = { role: 'guest' };
                next();
            }, (err, req, res, next) => {
                return res.status(401).send({ 'status':false, 'error_code':'EXP_TOKEN', 'message':'Your token has been expired...' })
            }
        ]
    }

    authorise(action) {
        return this.rbac.authorize(action);
    }
}

module.exports = Security;