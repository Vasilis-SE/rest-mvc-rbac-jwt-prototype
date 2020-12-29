const chalk = require('chalk');
const {MongoClient} = require('mongodb');

class MongoDB {

    static async init() {
        try {
            const url = `mongodb://${process.env.MONGODB_IP}:${process.env.MONGODB_PORT}`;
            MongoDB.client = new MongoClient(url, { useUnifiedTopology: true });
            await MongoDB.client.connect();

            // Check if connection is established
            await MongoDB.client.db("admin").command({ ping: 1 });
            console.log(chalk.rgb(255, 255, 255).bold( chalk.bgGreen('  Connected with mongodb...  ')));
        } catch (e) {
            await MongoDB.close();
            console.log( e );
        }
    }

    static async close() {
        await MongoDB.client.close();
    }

    static async countriesCollection() {
        try {
            const database = await MongoDB.client.db("general");
            const collection = database.collection("countries");
            return collection;
        } catch (e) {
            await MongoDB.close();
            console.log( e );
        }
    }

} // End of class

module.exports = MongoDB;