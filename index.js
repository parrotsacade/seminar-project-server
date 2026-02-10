const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Ready");
});

const { MongoClient, ServerApiVersion } = require("mongodb");
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
    const seminarCol = client.db("PSeminarDB").collection("users")

    app.post("/seminar",async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await seminarCol.insertOne(data)
      res.json({
        success:true,
        msg:"Successfully Submited",
        result:result
      })
    });

    app.get("/seminar",async(req,res)=>{
        const result = await seminarCol.find().toArray()
        res.send(result)
    })




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
