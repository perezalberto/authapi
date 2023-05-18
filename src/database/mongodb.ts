import { MongoClient } from "mongodb"
import { MONGO_DBNAME, MONGO_URI } from "../configs/mongodb.config.js"

const client = new MongoClient(MONGO_URI)
await client.connect()
export const db = client.db(MONGO_DBNAME)
