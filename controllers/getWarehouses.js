const WarehouseModel = require("../models/schemas/warehouse");

async function getWarehouses(req, res) {
  const { DateFrom, DateTo } = req.query;
  const DefaultDataTransferPeriodInDays = 10;

  let filter = {};

  // Перевіряємо наявність DateFrom і DateTo
  if (!DateFrom && !DateTo) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(yesterday);
    startOfYesterday.setDate(
      startOfYesterday.getDate() - DefaultDataTransferPeriodInDays
    );

    filter["Goods.SalesAndRemains"] = {
      $elemMatch: {
        SalesDate: { $gte: startOfYesterday },
      },
    };
  } else {
    filter["Goods.SalesAndRemains"] = {};

    if (DateFrom) {
      const yearDateFrom = DateFrom.slice(0, 4);
      const monthDateFrom = DateFrom.slice(4, 6);
      const dayDateFrom = DateFrom.slice(6, 8);

      filter["Goods.SalesAndRemains"].$elemMatch = {
        SalesDate: {
          $gte: new Date(yearDateFrom, monthDateFrom - 1, dayDateFrom, 2, 0, 0),
        },
      };
    }

    if (DateTo) {
      const yearDateTo = DateTo.slice(0, 4);
      const monthDateTo = DateTo.slice(4, 6);
      const dayDateTo = DateTo.slice(6, 8);

      if (!filter["Goods.SalesAndRemains"].$elemMatch) {
        filter["Goods.SalesAndRemains"].$elemMatch = {};
      }

      const endDate = new Date(yearDateTo, monthDateTo - 1, dayDateTo, 2, 0, 0);
      if (endDate > new Date()) {
        endDate.setHours(0, 0, 0, 0);
      }

      filter["Goods.SalesAndRemains"].$elemMatch.SalesDate = {
        ...(filter["Goods.SalesAndRemains"].$elemMatch.SalesDate || {}),
        $lte: endDate,
      };
    }
  }

  const result = await WarehouseModel.find(filter).select("-_id");

  res.json({
    Partner: 413190,
    Warehouses: result,
  });
}

module.exports = getWarehouses;
