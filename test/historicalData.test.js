const request = require("supertest");
const historicalDataModel = require("../module/historicalData");
let server;
describe("/coins", () => {
  beforeEach(() => {
    server = require("../index");
  });
  afterEach(async () => {
    server.close();
    await historicalDataModel.remove({});
  });
  describe("GET /", () => {
    it("should connectted to database and return all historical data", async () => {
      await historicalDataModel.collection.insertMany([
        {
          _id: "601c861a3496b64502a0e11c",
          Currency: "bitcoin",
          Date: "2019-10-27T00:00:00.000Z",
          Open: 9241.71,
          High: 9749.53,
          Low: 9112.54,
          Close: 9551.71,
          Volume: 32593129501,
          MarketCap: 172087039875,
        },
        {
          _id: "601c861a3496b64502a0e11a",
          Currency: "bitcoin",
          Date: "2019-10-29T00:00:00.000Z",
          Open: 9248.44,
          High: 9516.18,
          Low: 9232.65,
          Close: 9427.69,
          Volume: 28426779937,
          MarketCap: 169883866262,
        },
      ]);

      const res = await request(server).get("/api/coins");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.Currency === "bitcoin")).toBeTruthy();
      expect(res.body.some((g) => g.Currency === "bitcoin")).toBeTruthy();
    });
  });
});
