import "server-only"
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.DB_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function getDB(dbName) {
    try {
        await client.connect()
        console.log('db connected');
        return client.db(dbName)
    } catch (e) {
        console.log(e);
    }
}

export async function getCollection(collectionName) {
    const db = await getDB('next_blog_db')
    if(db) return db.collection(collectionName)

    return null
}