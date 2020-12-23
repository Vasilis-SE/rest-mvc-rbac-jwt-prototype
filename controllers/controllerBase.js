class ControllerBase {
    constructor({ params, query, body, send, uriGenerator }) {
        this.uriGenerator = uriGenerator;
        this.params = params;
        this.query = query;
        this.body = body;
        this.send = send;
    }

    success(data) { this.send(200, data); }
    created(data) { this.send(201, data); }
    accepted(data) { this.send(202, data); }
    nocontent() { this.send(204); }
    badrequest() { this.send(400); }
    unauthorized() { this.send(401); }
    error(err) { this.send(500, err); }
}

module.exports = ControllerBase;