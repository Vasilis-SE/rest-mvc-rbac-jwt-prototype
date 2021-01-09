// External modules
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { BasicStrategy } = require('passport-http');
const { Strategy: AnonymousStrategy } = require('passport-anonymous');
const { Strategy: JwtStrategy } = require('passport-jwt');

// Custom modules
const { ExtractJwt } = require('passport-jwt');
const RBACAuthorization = require('./rbacAuthorization');
const UserModel = require('../models/userModel');

class Security {
    constructor() {
        this.rbacAuthorization = new RBACAuthorization();
        this.initPassport();
    }

    initPassport() {
        passport.use(new AnonymousStrategy());
        passport.use(new BasicStrategy(async (email, password, done) => {
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

                console.log('--- 1 ---');
                done(null, userModel.getResource());
            } catch(err) {
                done(err);
            }
        }));

        passport.use(new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        }, (user, done) => { 
            console.log('--- 4 ---');
            done(null, user);
        } ));
    }

    issueToken() {
        return [
            passport.authenticate('basic', { session: false }), async (req, res) => {
                console.log('--- 3 ---');
                let { user } = req;
                let token = await jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
                    expiresIn:  2400000 // 240sec
                });
                
                res.json({'status': true, 'token': token});
            }
        ];
    }

    authenticate() {
        return [
            passport.authenticate(['jwt'], {session: false }), (req, res, next) => {
                console.log( '----- 1 -----' );
                if (!req.user) req.user = { role: 'guest' };
                next();
            }
        ]

        // return (req, res, next) => {
        //     console.log( '----- 2 -----' );

        //     if (!req.user) req.user = { role: 'guest' };
        //     next();
        // } 
    }

    authorise(controller, action) {
        return this.rbacAuthorization.authorize(controller, action);
    }

}

module.exports = Security;