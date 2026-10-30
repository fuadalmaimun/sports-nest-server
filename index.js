import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";


const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_DB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Collection create in mongoDB
const connectClient = await connectToMongoDB();
const db = connectClient.db("sports-nest");
const facilitiesCollection = db.collection("facilities");

// data insert in mongoDB
app.post("/facilities", async (req, res) => {
  const facilityData = req.body;
  const result = await facilitiesCollection.insertOne(facilityData);
  res.send(result);
});

// data get from mongoDB
app.get("/facilities", async (req, res) => {
  const result = await facilitiesCollection.find().toArray();
  res.send(result);
});

// facility details page data get from mongoDB
app.get("/facilities/:id", async (req, res) => {
  const { id } = req.params;
  const result = await facilitiesCollection.findOne({_id: new ObjectId(id)});

  res.send(result);
});

app.get("/test", (req, res) => {
  res.send({ message: "Hello API" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
