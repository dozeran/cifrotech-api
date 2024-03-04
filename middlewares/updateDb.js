const axios = require("axios");
const { MongoClient } = require("mongodb");

function updateDb(req, res, next) {
  async () => {
    try {
      const jsonData = await axios.get(process.env.JSON_FILE_URL);
      const client = new MongoClient(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db("main-database");
      const collection = db.collection("sales");
      await collection.deleteMany({});
      await collection.insertMany(jsonData.data);
      console.log("Update successful");
      await client.close();
    } catch (error) {
      console.error("Update unsuccessful:", error);
    }
  };
}

module.exports = updateDb;
