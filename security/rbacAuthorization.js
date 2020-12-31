const { RBAC } = require('rbac');

class RBACAuthorization {

    // Constructor
    constructor() {
        this.roles = {
            guest: 3,
            basic: 2,
            admin: 1
        };

        this.accessLevels = [
            {
                role: this.roles.guest,
                level: 10,
            }, {
                role: this.roles.basic,
                level: 20,
            }, {
                role: this.roles.admin,
                level: 30,
            }
        ];


        this.rbac = new RBAC (
            {
                roles: this.accessLevels.map(al => al.role),
                permissions: {
                    CountriesController: [
                        'getCountries',
                        'getCountryByID',
                        'removeCountryByID'
                    ]
                },
                grants: {
                    Guest: [
                        'index_IndexController',
                        'getBooks_BooksListController',
                        'getBook_BooksListController',
                    ],
                    BasicUser: [
                        'Guest',
                        'rateBook_BooksListController',
                    ],
                    AdminUser: [
                        'BasicUser',
                        'removeBook_BooksListController',
                    ],
                },
            }, (err) => {
                if (err) {
                    throw err;
                }
            }
        );
    }

    // getGuestAccessLevel() {
    //     return this.accessLevels.find(lvl => lvl.role === this.roles.guest);
    // }

    hasAccess(role, controller, action, cb) {
        this.rbac.can(role, action, controller, cb);
    }

    canAny(role, permissions, cb) {
        this.rbac.canAny(role, permissions, cb);
    }

    authorize(controller, action) {
        console.log("--- 1 ---");
        
        return (req, res, next) => this.rbac.can(req.user.role, action, controller, (err, can) => {
            if (err) return next(err);

            console.log("--- 2 ---");
            if (!can) {
                console.log("--- 3 ---");
                const errorResponse = {
                    error_description: {
                        type: 'access_denied',
                        message: 'Access denied'
                    }
                };
                const accessLevel = this._minNeededAccessLevel(controller, action);

                if (accessLevel != null) {
                    errorResponse.accessLevel = accessLevel;
                }

                return res.status(403).send(errorResponse);
            }

            next();
        });
    }

    _minNeededAccessLevel(controller, action) {
        const roles = this._whoCan(controller, action);
        const rolesAccessLevels = this.accessLevels.filter(al => roles.includes(al.role)).map(al => al.level);
        return rolesAccessLevels.length > 0 ? Math.min(...rolesAccessLevels) : null;
    }

    _whoCan(controller, action) {
        const rolesIncludePermission = [];
        this.rbac.getRoles((err, roles) => {
            if (err) throw err;

            roles.forEach((role) => {
                role.can(action, controller, (err2, can) => {
                    if (err2) throw err2;

                    if (can) rolesIncludePermission.push(role.name);
                });
            });
        });

        return rolesIncludePermission;
    }
}

module.exports = RBACAuthorization;