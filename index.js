const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const categories = require("./data/categories.json");
const allCarToys = require("./data/single_toy.json");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ol7jmji.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //db connection
    const toyCollection = client.db("carToysDB").collection("carToys");

    app.get("/carToys", async (req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    });

    // load categories data
    app.get("/categories", (req, res) => {
      res.send(categories);
    });

    // load data by category
    app.get("/categories/:id", (req, res) => {
      const id = parseInt(req.params.id);
      console.log(id);
      if (id === 0) {
        res.send(allCarToys);
      } else {
        const categoryToys = allCarToys.filter(
          (sub) => parseInt(sub.category_id) === id
        );
        res.send(categoryToys);
      }
    });

    // Send a ping to confirm a successful connection
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

// check server is running
app.get("/", (req, res) => {
  res.send("e-car toys server is running");
});

app.listen(port, () => {
  console.log(`e-car toys is running on port: ${port}`);
});
