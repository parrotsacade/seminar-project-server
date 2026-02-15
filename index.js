const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Ready");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://parrotsacademyteacher_db_user:dKZ1WKpuYkpRuuii@cluster0.1msvaql.mongodb.net/?appName=Cluster0";

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
    await client.connect();
    const seminarCol = client.db("PSeminarDB").collection("users");

    // This is for create
    app.post("/seminar", async (req, res) => {
      const data = req.body;
      const email = req.body.email;
      const allUserEmail = await seminarCol.find({ email }).toArray();
      if (allUserEmail.length > 0) {
        throw Error("This email already exist");
      }
      const result = await seminarCol.insertOne(data);
      res.json({
        success: true,
        msg: "Successfully Submited",
        result: result,
      });
    });

    // this is for read All / get All
    app.get("/seminar", async (req, res) => {
      const result = await seminarCol.find().toArray();
      res.send(result);
    });

    // this is for read single / get single

    app.get("/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id, "user id");
      const result = await seminarCol.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // this is for delete with body
    // app.delete("/delete", async (req, res) => {
    //   const id = req.body.id;
    //   console.log(id);
    //   const result = await seminarCol.deleteOne({ _id: new ObjectId(id) });
    //   console.log(result);
    //   res.send(result);
    // });

    // this is for delete with params

    app.delete("/seminar/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await seminarCol.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // This is for update
    app.patch("/seminar/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const newName = req.body.name;
      console.log(newName, "newname");
      const updateDoc = {
        $set: {
          name: newName,
        },
      };
      const result = await seminarCol.updateOne(filter, updateDoc);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(5000, () => {
  console.log("server running is 5000");
});
