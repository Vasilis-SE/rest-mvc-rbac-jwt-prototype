const {MongoClient} = require('mongodb');
class MongoDB {
    #client = null;

    constructor() {
        this.init();
    }

    static async init() {
        try {
            const url = `mongodb+srv://${process.env.MONGODB_IP}:${process.env.MONGODB_PORT}/?poolSize=20&w=majority`;
            this.#client = new MongoClient(url);
            await this.#client.connect();

            // Check if connection is established
            await this.#client.db("admin").command({ ping: 1 });
        } catch (e) {
            await this.close();
            console.log( e );
        }
    }

    static async close() {
        await this.#client.close();
    }

    static async countriesCollection() {
        try {
            const database = await this.#client.db("general");
            const collection = database.collection("countries");
            return collection;
        } catch (e) {
            await this.close();
            console.log( e );
        }
    }

} // End of class

module.exports = MongoDB;