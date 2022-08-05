const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        app.post('/tasks', async (req, res) => {
            const data = req.body;
            const result = await taskCollection.insertOne(data);
            res.send(result);
        })

        // getting task
        app.get('/your-tasks', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = taskCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        //getting single task to edit
        app.get('/edit-task/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);

        })
        // editing a task
        app.put("/edit-task/:email", async (req, res) => {
            const email = req.params.email;

            const user = req.body;

            const query = { email: email };
            const options = { upsert: true };
            const info = {
                $set: {
                    email: user.email,
                    name: user.name,
                    des: user.des,
                    time: user.time,
                    date: user.date,
                },
            };
            const result = await taskCollection.updateOne(query, info, options);

            res.send(result);
        });



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