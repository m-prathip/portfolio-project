const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  "mongodb+srv://prathipmuniraju_db_user:DFImh5MAJ3qXU7pX@cluster0.qtqnyfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected!");
  } catch (err) {
    console.error("Connection Error:", err);
  } finally {
    await client.close();
  }
}

run();