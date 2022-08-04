const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;


const uri = "mongodb+srv://ananna:GLxy1oaAb2GafPdq@cluster0.va7ke.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

async function run() {
    try {
      await client.connect();
    } finally {
      
    }
  }
  run().catch(console.dir);


// testing server 
app.get('/', (req, res) => {
    res.send('Hello from ToDo server')
})

app.listen(port, () => {
    console.log("server is running on port", port);
})