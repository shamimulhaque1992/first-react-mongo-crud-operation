const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const objectId = require("mongodb").ObjectId;
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// username:shamimulhaque
// password:SPlTATZyeNKVjrKS

const uri =
  "mongodb+srv://shamimulhaque:SPlTATZyeNKVjrKS@cluster0.ecwqp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const userCollection = client.db("FoodExpress").collection("user");

    //GET multiple Users: getting a new user.
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // GET single user: getting a new user
    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //POST User: adding a new user.
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log(`adding new user`, newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    //Deleting a user
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    //Updating user
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: objectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });
    const user = {
      name: "khandoker Shamimul Haque",
      email: "khandoker15-1992@diu.edu.bd",
    };
  } finally {
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Running node server on ports ${port}`);
});
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
