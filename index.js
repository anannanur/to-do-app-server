const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

// connecting database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.va7ke.mongodb.net/?retryWrites=true&w=majority`;
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
        app.put("/edit-task/:id", async (req, res) => {
            const {id} = req.params;
            const user = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const info = {
                $set: {                 
                    name: user.name,
                    des: user.des,
                    date: user.date,
                    time: user.time,
                    email : user.email
                },
            };
            const result = await taskCollection.updateOne(query, info, options);
            res.send(result);
        });

        // removing data from task collection
        app.delete("/task/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
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