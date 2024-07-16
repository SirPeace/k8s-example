const { connectToMongoDb } = require("./db.js")
const express = require("express")

const webapi = express()
webapi.use(express.json())
webapi.use(express.urlencoded({ extended: true }))

webapi.get("/hello", (req, res) =>
  res.json({
    message: `Hello, ${req.query.name ?? "guest"}!`,
  })
)

webapi.get("/user", async (_, res) => {
  const db = await connectToMongoDb()
  if (db === null) {
    return res.status(500).send({ error: "Cannot connect to db!" })
  }

  const user = await db.collection("users").findOne({})

  return res.json(user)
})

webapi.post("/user", async (req, res) => {
  const db = await connectToMongoDb()
  if (db === null) {
    return res.status(500).send({ error: "Cannot connect to db!" })
  }

  const user = await db.collection("users").findOne({})
  if (user === null) {
    console.log("inserting...", JSON.stringify(req.body))
    await db.collection("users").insertOne(req.body)
  } else {
    console.log("updating...", JSON.stringify(req.body))
    await db.collection("users").updateOne({}, { $set: req.body })
  }

  return res.status(201).send()
})

const port = process.env.PORT ?? 3000
webapi.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
