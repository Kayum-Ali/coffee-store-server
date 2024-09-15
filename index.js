const express = require('express')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb')
const cors = require('cors')
const app =  express();
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dangeag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeDB = client.db("coffeeDB");
    const coffeeCollection = coffeeDB.collection("coffee");

    app.get('/coffee' , async(req,res)=>{
        const cursor = await coffeeCollection.find().toArray()
   
        res.send(cursor)
    })

    app.post('/coffee', async(req,res)=>{
    const newcoffee = req.body
    const result = await coffeeCollection.insertOne(newcoffee);
    res.send(result)
    
     })

     app.delete(`/coffee/:id`, async(req,res)=>{
        const id = req.params.id;
        const body = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await coffeeCollection.deleteOne(query);
        res.send(result)
     })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
   
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Coffee server is Running!')
})

app.listen(port, (req, res)=>{
    console.log(`Server is running on port ${port}`)
})  