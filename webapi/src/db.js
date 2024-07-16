const { Db, MongoClient, MongoError } = require("mongodb")

/** @type {Db | undefined} */
let dbConnection

/**
 * @returns {Promise<Db?>}
 * @throws {MongoError}
 */
async function connectToMongoDb() {
  if (dbConnection) {
    return dbConnection
  }

  const config = {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    database: process.env.MONGO_DATABASE,
  }

  if (Object.values(config).includes(undefined)) {
    console.error("Cannot connect to mongodb, missing connection options")
    return null
  }

  const mongo = new MongoClient(
    `mongodb://${config.host}:${config.port}/${config.database}`,
    {
      authSource: "admin",
      auth: {
        username: config.username,
        password: config.password,
      },
    }
  )

  try {
    await mongo.connect()
    dbConnection = mongo.db("db")
    return dbConnection
  } catch (err) {
    if (err instanceof MongoError) {
      console.error("Mongo connection error:")
      console.log(err.message)
      console.log(err.stack)
    } else {
      console.error("Unknown error when connecting to mongo:")
      console.error(err)
    }
    return null
  }
}

module.exports = { connectToMongoDb }
