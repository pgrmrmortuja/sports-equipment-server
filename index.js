const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dk8ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
       
        // await client.connect();

        const database = client.db('equipmentDB');

        const equipmentCollection = database.collection('equipment');

        app.get('/equipments', async (req, res) => {
            const cursor = equipmentCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/equipments-limited', async (req, res) => {
            const limit = parseInt(req.query.limit) || 6;
            const cursor = equipmentCollection.find().limit(limit); 
            const result = await cursor.toArray(); 
            res.send(result);
        });

        app.get('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await equipmentCollection.findOne(query);
            // res.send(result);
        })

        app.get('/categories/:category', async(req, res) =>{
            const category = req.params.category;
            const filter = { category: category };
            const result = await equipmentCollection.find(filter).toArray(); 
            res.send(result);
        })

        app.get('/myEquipments/:email', async(req, res) =>{
            const email = req.params.email;
            const filter = { email: email };
            const result = await equipmentCollection.find(filter).toArray(); 
            res.send(result);
        })

    

        app.post('/equipments', async (req, res) => {
            const newEquipment = req.body;
            console.log(newEquipment);

            const result = await equipmentCollection.insertOne(newEquipment);
            res.send(result);
        })

        app.put('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const update = req.body;
            const equipment = {
                $set: { 
                    photo: update.photo,
                    item: update.item,
                    category: update.category,
                    description: update.description,
                    price: update.price,
                    rating: update.rating,
                    customization: update.customization,
                    processing: update.processing,
                    stockStatus: update.stockStatus,

                }
            }

            const result = await equipmentCollection.updateOne(filter, equipment, options);
            res.send(result);
        })

        app.delete('/equipments/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await equipmentCollection.deleteOne(query);
            res.send(result);
        })

        

        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
       
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Equipments server is running.')
})

app.listen(port, () => {
    console.log(`Equipments Server is running on port: ${port}`);
})