// External modules
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const { Strategy: AnonymousStrategy } = require('passport-anonymous');
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy } = require('passport-jwt');

// Custom modules
const { ExtractJwt } = require('passport-jwt');
const RBACAuthorization = require('./rbacAuthorization');
const UserModel = require('../models/userModel');

class Security {
    constructor() {
        this.rbacAuthorization = new RBACAuthorization();
        this._setStrategies();
    }

    issueToken() {
        return [
            passport.authenticate('basic', { session: false }), async (req, res) => {
                const { user } = req;

                const token = await jwt.sign({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }, process.env.JWT_SECRET);

                res.json(token);
            }
        ];
    }

    authenticate() {
        return [
            passport.authenticate(['jwt', 'anonymous'], { session: false }), (req, res, next) => {
                if (!req.user) req.user = { role: 0 };
                next();
            }
        ];
    }

    authorise(controller, action) {
        return this.rbacAuthorization.authorize(controller, action);
    }

    hasAccess(role, controller, action, cb) {
        return this.rbacAuthorization.hasAccess(role, controller, action, cb);
    }

    canAny(role, permissions, cb) {
        return this.rbacAuthorization.canAny(role, permissions, cb);
    }

    _setStrategies() {
        passport.use(new AnonymousStrategy());

        passport.use(new BasicStrategy((email, password, done) => {
            let user;
            try {
                // user = this.repository.user.getByEmail(email);

                if (!user) return done(null, false);

                if (!UserService.checkPassword(user.hashedPassword, user.salt, password)) {
                    return done(null, false);
                }

                done(null, user);
            } catch (err) {
                done(err);
            }
        }));

        passport.use(new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        }, (user, done) => done(null, user)));
    }
}

module.exports = Security;