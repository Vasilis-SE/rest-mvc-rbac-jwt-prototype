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