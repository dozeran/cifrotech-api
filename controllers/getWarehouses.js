const moment = require("moment");

const WarehouseModel = require("../models/schemas/warehouse");

async function getWarehouses(req, res) {
  const { DateFrom, DateTo } = req.query;
  const DefaultDataTransferPeriodInDays = 10;
  const secondsInDay = 24 * 60 * 60;

  let dateTo = DateTo
    ? moment(DateTo, "YYYYMMDD").toDate()
    : moment().subtract(1, "days").startOf("day").toDate();
  let dateFrom = DateFrom
    ? moment(DateFrom, "YYYYMMDD").toDate()
    : new Date(
        dateTo.getTime() - DefaultDataTransferPeriodInDays * secondsInDay * 1000
      );

  if (dateFrom > dateTo) {
    dateFrom = new Date(
      dateTo.getTime() - DefaultDataTransferPeriodInDays * secondsInDay * 1000
    );
  }

  if (dateTo > moment().startOf("day").toDate()) {
    dateTo = moment().startOf("day").toDate();
    if (dateFrom > dateTo) {
      dateFrom = new Date(
        dateTo.getTime() - DefaultDataTransferPeriodInDays * secondsInDay * 1000
      );
    }
  }

  dateFrom.setDate(dateFrom.getDate() - 1);
  dateTo.setDate(dateTo.getDate() - 1);

  const result = await WarehouseModel.aggregate([
    { $unwind: "$Goods" },
    { $unwind: "$Goods.SalesAndRemains" },
    {
      $match: {
        "Goods.SalesAndRemains.SalesDate": { $gte: dateFrom, $lte: dateTo },
      },
    },
    {
      $group: {
        _id: { warehouse: "$_id", good: "$Goods.SKU" },
        Warehouse: { $first: "$Warehouse" },
        SKU: { $first: "$Goods.SKU" },
        GoodName: { $first: "$Goods.GoodName" },
        SalesAndRemains: { $push: "$Goods.SalesAndRemains" },
      },
    },
    {
      $group: {
        _id: "$_id.warehouse",
        Warehouse: { $first: "$Warehouse" },
        Goods: {
          $push: {
            SKU: "$SKU",
            GoodName: "$GoodName",
            SalesAndRemains: "$SalesAndRemains",
          },
        },
      },
    },
    { $project: { _id: 0, "Goods._id": 0, "Goods.SalesAndRemains._id": 0 } },
  ]);

  result.forEach((warehouse) => {
    warehouse.Goods.forEach((good) => {
      good.SalesAndRemains.forEach((saleAndRemain) => {
        saleAndRemain.SalesDate = moment(saleAndRemain.SalesDate).format(
          "DD/MM/YY"
        );
      });
    });
  });

  res.json({
    Partner: 413190,
    Warehouses: result,
  });
}

module.exports = getWarehouses;
