const express = require("express");
const error = require("../middleware/error");
const coins = require("../routes/coins");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/coins", coins);

  app.use(error);
};
