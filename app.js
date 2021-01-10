class App {

    // Constructor
    constructor(router, security) {
        this.router = router;
        this.security = security;

        this.initRoutes = this.initRoutes.bind(this);
        this.bindRoutesToControllerActions = this.bindRoutesToControllerActions.bind(this);
    }

    initRoutes(uri, httpMethod, boundAction) {
        throw new Error();
    }

    initAuthorizationRoutes() {
        throw new Error();
    }

    bindRoutesToControllerActions(controllerClass, method) {
        const result = [
            this.security.authenticate(),
            this.security.authorise(method),
            (req, res) => {
                this.buildMainControllerInstance(controllerClass, req, res)[method]();
            }
        ];

        return result;
    }

    buildMainControllerInstance(ControllerClass, req, res) {
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
        this.router.registerRoutes(this.initRoutes, this.bindRoutesToControllerActions);
        this.initAuthorizationRoutes(this.security.generateToken());
    }
}

module.exports = App;