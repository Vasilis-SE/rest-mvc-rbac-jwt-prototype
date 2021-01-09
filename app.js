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
            this.security.authenticate(),
            this.security.authorise(method),
            (req, res) => {
                this._buildControllerInstance(controllerClass, req, res)[method]();
            }
        ];

        return result;
    }

    _buildControllerInstance(ControllerClass, req, res) {
        const controller = new ControllerClass({
            params: req.params,
            query: req.query,
            body: req.body,
            send: (statusCode, resource, location) => {
                if (location) {
                    res.location(location);
                }

                res.status(statusCode).send(resource);
            }
        });

        return controller;
    }

    run() {
        this.router.registerRoutes(this._registerRoute, this._createRouteBoundAction);
        this._registerAuthRoute(this.security.issueToken());
    }
}

module.exports = App;