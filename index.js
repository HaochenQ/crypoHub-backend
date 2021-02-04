const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT || 3000;
const Server = app.listen(port, () => {
  console.log(`Listening on port:${port}`);
});

module.exports = Server;
