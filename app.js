class App {

    // Constructor
    constructor(router, security) {
        this.router = router;
        this.security = security;

        this._registerRoute = this._registerRoute.bind(this);
        this._createRouteBoundAction = this._createRouteBoundAction.bind(this);
    }

    _registerRoute(uri, httpMethod, boundAction) {
        throw new Error('Not Implemented Exception');
    }

    _registerAuthRoute() {
        throw new Error('Not Implemented Exception');
    }

    _createRouteBoundAction(controllerClass, method) {
        const result = [
            (req, res) => {
                this._buildControllerInstance(controllerClass, req, res)[method]();
            }
        ];

        result.unshift( 
            this.security.authenticate(),
            this.security.authorise(controllerClass.name, method),
        );
    
        return result;
    }

    _buildControllerInstance(ControllerClass, req, res) {
        const inst = new ControllerClass({
            params: req.params,
            query: req.query,
            body: req.body,
            send: (statusCode, resource, location) => {
                if (location) {
                    res.location(location);
                }

                res.status(statusCode).send(resource);
            },
        });

        return inst;
    }

    run() {
        this.router.registerRoutes(this._registerRoute, this._createRouteBoundAction);
        this._registerAuthRoute(this.security.issueToken());
    }
}

module.exports = App;