class mainController {
    constructor({ params, query, body, user, send }) {
        this.params = params;
        this.query = query;
        this.body = body;
        this.user = user;
        this.send = send;

        this.responseCode = 200;
        this.response = {};
    }

    // handleResponseByHTTPCode() {
    //     switch( this.responseCode ) {
    //         case 200: success(); break;
    //         case 201: created(); break;
    //         case 202: accepted(); break;
    //         case 204: nocontent(); break;
    //         case 400: badrequest(); break;
    //         case 401: unauthorized(); break;
    //         case 500: error(); break;
    //     }
    // }

    sendResponse() { this.send(this.responseCode, this.response) }

    success(data) { this.send(200, data); }
    created(data) { this.send(201, data); }
    accepted(data) { this.send(202, data); }
    nocontent() { this.send(204); }
    badrequest() { this.send(400); }
    unauthorized() { this.send(401); }
    error(err) { this.send(500, err); }

    getResponse() { return this.response; }
    setResponse(c, r) { 
        this.responseCode = c; 
        this.response = r; 
    }
}

module.exports = mainController;