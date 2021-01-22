// External modules
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { BasicStrategy } = require('passport-http');
const { Strategy: JwtStrategy } = require('passport-jwt');

// Custom modules
const { ExtractJwt } = require('passport-jwt');
const RBAC = require('./rbac');
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

    async basicStrategy(email, password, done) {
        try {                
            let userModel = new UserModel();
            userModel.setEmail( email );

            let result = await userModel.userExists();
            if(!result) throw new Error('Could not find user...');
            
            // If user is found then init the users object
            userModel.setID( result );
            if(!await userModel.getUserByID()) throw new Error('Could not initialize user...');

            // Check login password credentials
            if(!await userModel.checkLoginCredentials( password )) throw new Error('Invalid credentials given...');

            done(null, userModel.getResource());
        } catch(err) {
            done(err);
        }
    }

    async jwtStrategy(user, done) {
        try {            
            let userModel = new UserModel();
            userModel.setID( user._id );

            if(!await userModel.getUserByID()) throw new Error('Could not initialize user...');

            done(null, userModel.getResource());
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
                let token = await jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
                    expiresIn:  7200 // 7200 sec / 2 hours
                });
                
                res.status(200).send({'status': true, 'token': token});
            }, (err, req, res) => {
                return res.status(401).send({ 'status':false, 'error_code':'GEN_TOKEN', 'message':'Could not generate token...' })
            }
        ];
    }

    authenticate() {
        let jwtAuthOptions = { session: false, failWithError: true };
        
        return [
            passport.authenticate('jwt', jwtAuthOptions), 
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