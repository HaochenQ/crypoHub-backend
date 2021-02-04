const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const diffSec = require("../utils/getSecInDay");
const historicalDataModel = require("../module/historicalData");
const PriceDifference = require("../utils/difference");

//assume current is 2019-12-04
const currentDate = new Date("2019-12-04T00:00:00.000Z");
//get the date of 1 day/1 week/1 month ago
const lastDay = new Date(currentDate.getTime() - diffSec(1));
const lastWeek = new Date(currentDate.getTime() - diffSec(7));
const lastMonth = new Date(currentDate.getTime() - diffSec(30));

router.get("/", async (req, res) => {
  const historicalData = await historicalDataModel.find().sort("-MarketCap");
  res.send(historicalData);
});
router.get("/markets", async (req, res) => {
  //retrive relevant data from db
  const CurrentData = await historicalDataModel
    .find({ Date: currentDate })
    .lean();
  const YesterdayData = await historicalDataModel
    .find({ Date: lastDay }, ["Currency", "Close"])
    .lean();
  const LastWeekData = await historicalDataModel
    .find({ Date: lastWeek }, ["Currency", "Close"])
    .lean();
  const LastMonthData = await historicalDataModel
    .find({ Date: lastMonth }, ["Currency", "Close"])
    .lean();

  // data will be returned
  const returnObject = CurrentData.map((coinObj) => {
    const difference_24h = PriceDifference(
      coinObj.Close,
      YesterdayData.find((item) => item.Currency === coinObj.Currency).Close
    );
    const difference_7d = PriceDifference(
      coinObj.Close,
      LastWeekData.find((item) => item.Currency === coinObj.Currency).Close
    );
    const difference_30d = PriceDifference(
      coinObj.Close,
      LastMonthData.find((item) => item.Currency === coinObj.Currency).Close
    );
    return {
      Coin: coinObj.Currency,
      Price: coinObj.Close,
      Difference_24h: difference_24h,
      Difference_7d: difference_7d,
      Difference_30d: difference_30d,
      Volume_24h: coinObj.Volume,
      MarketCap: coinObj.MarketCap,
      High_24h: coinObj.High,
      Low_24h: coinObj.Low,
    };
  });

  res.send(returnObject);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const days = req.query.days;
  const data = await fetchData(id, days);
  res.send(data);
});

//fetch data from givenDate to currentDate based on id
const fetchData = async (id, days) => {
  let Data = [];
  if (days === "7") {
    Data = await historicalDataModel
      .find({ Currency: id, Date: { $gte: lastWeek, $lt: currentDate } })
      .sort("Date");
  } else if (days === "30") {
    Data = await historicalDataModel
      .find({ Currency: id, Date: { $gte: lastMonth, $lt: currentDate } })
      .sort("Date");
  }
  return Data;
};

module.exports = router;
