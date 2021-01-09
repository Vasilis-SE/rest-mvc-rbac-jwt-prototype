class RBACAuthorization {
    #access = null;


    // Constructor
    constructor() {
        this.#access = {
            'admin': { 
                level: 1,
                routes: ['removeCountryByID']
            },
            'operator': { 
                level: 2,
                routes: ['getUser']
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

    authorize(controller, action) {
        return (req, res, next) => {
            console.log( '----- 2 -----' );

            // If there is no user instance initialized
            if(!req.user) 
                return res.status(500).send({'status': false, 'message': 'No user instance...'});
  
            // Gather all the routes that the user has access to
            let eligibleRoutes = [];
            let userIdx = Object.keys( this.#access ).indexOf( req.user.role );
            let rolesToIterate = Object.keys( this.#access ).splice(userIdx, Object.keys( this.#access ).length - 1, this.#access);
            for(let role of rolesToIterate) {
                eligibleRoutes.push( ...this.#access[ role ].routes );
            }

            // If the eligible routes are empty (so the user has no access in anything) or the user
            // does not have access to that specific route.
            if(eligibleRoutes.length === 0 || !eligibleRoutes.includes(action)) 
                // return res.status(403).send({'status': false, 'message': 'You are not authorized for this process...'});
            
            console.log(eligibleRoutes);

            next();
        };
    }


    // Getters - Setters
    getAccessList() { return this.#access; }

    setAccessList( access ) { this.#access = access; }
}

module.exports = RBACAuthorization;