require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 8000;

// Middle ware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://hilf-al-fudul.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.APP_ID}:${process.env.APP_PASS}@firstpractice.poejscf.mongodb.net/?retryWrites=true&w=majority`;


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
    // await client.connect();

    const usersCollections = client.db("Donation").collection("users");
    const foundersCollection = client.db("Donation").collection("founders");
    const volunteersCollection = client.db("Donation").collection("volunteers");
    const eventsCollection = client.db("Donation").collection("events");
    const donationsCollection = client.db("Donation").collection("donations");
    const commentsCollection = client.db("Donation").collection("comments");
    const contactMessageCollection = client
      .db("Donation")
      .collection("contactMessage");

    ///// Contact Message Collection \\\\\
    app.post("/contactMessage", async (req, res) => {
      const message = req.body;
      const result = await contactMessageCollection.insertOne(message);
      res.send(result);
    });

    app.get("/contactMessage", async (req, res) => {
      const result = await contactMessageCollection.find().toArray();
      res.send(result);
    });

    ///// Events Collection \\\\\
    app.delete("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await commentsCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/comments", async (req, res) => {
      const comment = req.body;
      const result = await commentsCollection.insertOne(comment);
      res.send(result);
    });

    app.get("/comments", async (req, res) => {
      const result = await commentsCollection.find().toArray();
      res.send(result);
    });

    ///// Events Collection \\\\\
    app.get("/donations", async (req, res) => {
      const result = await donationsCollection.find().toArray();
      res.send(result);
    });

    ///// Events Collection \\\\\
    app.get("/events", async (req, res) => {
      const result = await eventsCollection.find().toArray();
      res.send(result);
    });

    ///// joinVolunteer Collection \\\\\
    app.post("/joinVolunteer", async (req, res) => {
      const volunteer = req.body;
      const result = await volunteersCollection.insertOne(volunteer);
      res.send(result);
    });

    app.get("/joinVolunteer", async (req, res) => {
      const result = await volunteersCollection.find().toArray();
      res.send(result);
    });

    app.delete("/joinVolunteer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await volunteersCollection.deleteOne(query);
      res.send(result);
    });

    // founders routes
    app.post("/founders", async (req, res) => {
      const person = req.body;
      const result = await foundersCollection.insertOne(person);
      res.send(result);
    });

    app.get("/founders", async (req, res) => {
      const result = await foundersCollection.find().toArray();
      res.send(result);
    });

    app.delete("/founders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foundersCollection.deleteOne(query);
      res.send(result);
    });

    // users collection routes
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollections.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollections.find().toArray();
      res.send(result);
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

app.get("/", (req, res) => {
  res.send("Hello Hilf al-Fudul 🌴");
});

app.listen(port, () => {
  console.log(`Hilf al-Fudul app listening on port ${port}🌱`);
});
