const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5001;

//middleware

app.use(cors());
app.use(express.json());

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wzxk65v.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const taskCollections = client.db("taskForge").collection("allTask")

    app.post('/todo', async(req, res) =>{
        const todo = req.body;
        const result = await taskCollections.insertOne(todo)
        res.send(result)
    })
    app.get('/todo', async(req, res) =>{
        const query = req.query.status
        const email = req.query.email
        console.log(query,email, 'this is a query');
        const filter =  {status : query, taskCreator: email}
        const result = await taskCollections.find(filter).toArray()
        res.send(result)
    })
    app.delete('/todo/:id', async(req, res) =>{
        const id = req.params.id
        const filter = { _id: new ObjectId(id) };
        const result = await taskCollections.deleteOne(filter)
        res.send(result)
    })
  


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TaskForge server is running");
});

app.listen(port, () => {
  console.log(`TaskForge server is running on port:${port}`);
});
