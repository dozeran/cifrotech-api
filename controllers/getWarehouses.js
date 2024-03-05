const WarehouseModel = require("../models/schemas/warehouse");

const DEFAULT_DATA_TRANSFER_PERIOD = 10 * 24 * 60 * 60; // Період передачі даних за замовчуванням (10 днів)

async function getWarehouses(req, res) {
  let { DateFrom, DateTo } = req.query;

  const currentDate = new Date();
  const yesterdayStart = new Date(currentDate);
  yesterdayStart.setDate(currentDate.getDate() - 1);
  yesterdayStart.setHours(0, 0, 0, 0);

  if (!DateTo) {
    DateTo = yesterdayStart.toISOString().slice(0, 10).replace(/-/g, ""); // Начало вчерашнього дня
  }

  if (!DateFrom) {
    DateFrom = DateTo;
    DateFrom = new Date(
      yesterdayStart.getTime() - DEFAULT_DATA_TRANSFER_PERIOD * 1000
    )
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, ""); // Початок періоду передачі даних за замовчуванням
  }

  if (DateFrom > DateTo) {
    DateFrom = DateTo;
    DateFrom = new Date(
      yesterdayStart.getTime() - DEFAULT_DATA_TRANSFER_PERIOD * 1000
    )
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, ""); // Мінус період передачі даних за замовчуванням
  }

  const startDate = new Date(
    DateFrom.substring(0, 4),
    DateFrom.substring(4, 6) - 1,
    DateFrom.substring(6, 8)
  );
  const endDate = new Date(
    DateTo.substring(0, 4),
    DateTo.substring(4, 6) - 1,
    DateTo.substring(6, 8)
  );

  if (endDate > currentDate) {
    DateTo = currentDate.toISOString().slice(0, 10).replace(/-/g, ""); // Начало поточного дня
    if (DateFrom > DateTo) {
      DateFrom = DateTo;
      DateFrom = new Date(
        yesterdayStart.getTime() - DEFAULT_DATA_TRANSFER_PERIOD * 1000
      )
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, ""); // Мінус період передачі даних за замовчуванням
    }
  }

  // const filter = {
  //   "Goods.SalesAndRemains": {
  //     $elemMatch: {
  //       SalesDate: { $gte: startDate, $lte: endDate },
  //     },
  //   },
  // };

  const result = await WarehouseModel.find().select("-_id");

  res.json({
    Partner: 413190,
    Warehouses: result,
  });
}

module.exports = getWarehouses;
