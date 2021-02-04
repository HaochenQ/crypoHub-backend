const mongoose = require("mongoose");
const config = require("config");

module.exports = async () => {
  //get db address from the configration file
  const db = config.get("dbConfig.host");
  try {
    //using the new topology engine
    mongoose.set("useUnifiedTopology", true);
    //using the new URL parser
    mongoose.set("useNewUrlParser", true);
    //connect to mongoDB database
    await mongoose.connect(db, {
      useUnifiedTopology: true,
    });
    console.log(`Connected to ${db}...`);
  } catch (error) {
    console.error("Error Connecting to Database");
  }
};
