const { RBAC } = require('rbac');

class RBACAuthorization {

    // Constructor
    constructor() {
        this.access = {
            'admin': { 
                level: 1,
                routes: ['removeCountryByID']
            },
            'operator': { 
                level: 2,
                routes: []
            }, 
            'basic': { 
                level: 3,
                routes: [
                    'getCountries',
                    'getCountryByID'
                ]
            }, 
            'guest': { 
                level: 4,
                routes: []
            }
        };
    }

    hasAccess(role, controller, action, cb) {
        this.rbac.can(role, action, controller, cb);
    }

    canAny(role, permissions, cb) {
        this.rbac.canAny(role, permissions, cb);
    }

    authorize(controller, action) {
        return (req, res, next) => {
            // If there is no user instance initialized
            if(!req.user) 
                return res.status(500).send({'status': false, 'message': 'No user instance...'});
  
            // Gather all the routes that the user has access to
            let eligibleRoutes = [];
            let userIdx = Object.keys( this.access ).indexOf( req.user.role );
            let rolesToIterate = Object.keys( this.access ).splice(userIdx, Object.keys( this.access ).length - 1, this.access);
            for(let role of rolesToIterate) {
                eligibleRoutes.push( ...this.access[ role ].routes );
            }

            // If the eligible routes are empty (so the user has no access in anything) or the user
            // does not have access to that specific route.
            if(eligibleRoutes.length === 0 || !eligibleRoutes.includes(action)) 
                return res.status(403).send({'status': false, 'message': 'You are not authorized for this process...'});
            
            console.log(eligibleRoutes);

            next();
        };
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