class Router {
    constructor(routes) {
        this.routes = routes;
    }

    registerRoutes(initRoutesCallback, bindRoutesToControllerActionsCallback) {
        for(let domainRouteInst of this.routes) {
            const domainRoutes = domainRouteInst.getRoutes();

            for(let route of domainRoutes) {
                const bindedAction = bindRoutesToControllerActionsCallback(route.controllerClass, route.action);
                initRoutesCallback(route.uri, route.httpMethod, bindedAction);
            }
        }
    }
}

module.exports = Router;