const express = require('express');
const bodyParser = require('body-parser');
const App = require('./app');

// Connections
const MongoDB = require('./connections/mongo');
MongoDB.init();

class Express extends App {
    constructor(router, security) {
        super(router, security);

        this.express = express();
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());
        this.expressRouter = express.Router();
    }

    _registerRoute(uri, httpMethod, boundAction) {
        this.expressRouter.route(uri)[httpMethod](boundAction);
    }

    _registerAuthRoute(boundAction) {
        this.expressRouter.route('/auth/token').post(boundAction);
    }

    run() {
        super.run();

        this.express.use('/api/v1', this.expressRouter);
        
        this.express.use((req, res) => {
            res.status(404).send({ url: `${req.originalUrl} not found` });
        });
        
        this.express.listen(process.env.PORT, process.env.HOST);
        console.log(`RESTful API server started on ${process.env.HOST}:${process.env.PORT}`);
    }
}

module.exports = Express;