const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

// connecting database
const uri = "mongodb+srv://ananna:GLxy1oaAb2GafPdq@cluster0.va7ke.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

// working with rest api
async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("ToDoApp").collection("tasks");

        //   posting added tasks in db
        app.post('/tasks',(req,res)=>{
            const data = req.body;
            const result = await taskCollection.insertOne(data);
            res.send(result);
        })



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