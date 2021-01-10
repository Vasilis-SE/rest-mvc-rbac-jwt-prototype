class Router {
    constructor(routes) {
        this.routes = routes;
    }

    registerRoutes(registerRouteCallback, createRouteBoundActionCallback) {
        this.routes.forEach((builder) => {
            const routes = builder.getRoutes();
            
            routes.forEach((routeData) => {
                const boundAction = createRouteBoundActionCallback(routeData.controllerClass, routeData.action);
                registerRouteCallback(routeData.uri, routeData.httpMethod, boundAction);
            });
        });
    }
}

module.exports = Router;