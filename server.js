require("dotenv").config();
const bodyParser = require("body-parser");
require("./db");
const app = require("./app");

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000");
});
