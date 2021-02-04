const mongoose = require("mongoose");

const historicalDataSchema = new mongoose.Schema({}, { collection: "coins" });

const historicalData = mongoose.model("historicalData", historicalDataSchema);

module.exports = historicalData;
