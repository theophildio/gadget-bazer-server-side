const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const res = require("express/lib/response");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// Connect Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mhyxo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		await client.connect();
		const productCollection = client.db("wareHouse").collection("product");
    // Load all data
		app.get('/product', async (req, res) => {
			const query = {};
			const cursor = productCollection.find(query);
			const products = await cursor.toArray();
      res.send(products);
		});
    // Load single data
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const product = await productCollection.findOne(query);
      res.send(product);
    })
		// Update quantity
		app.put('/product/:id', async (req, res) => {
			const id = req.params.id;
			const updateStock = req.body;
			const filter = {_id: ObjectId(id)};
			const options = {upsert: true};
			const updateDoc = {$set: updateStock};
			const result = await productCollection.updateOne(filter, updateDoc, options);
			res.send(result);
		})
	} finally {
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Warehouse server running. All good.");
});

app.listen(port, () => {
	console.log("Listing to port:", port);
});
