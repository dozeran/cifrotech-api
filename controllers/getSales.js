const saleModel = require("../models/schemas/sale");

async function getSales(req, res) {
  const filter = {};

  const result = await saleModel.find(filter);

  res.json(result);
}

module.exports = getSales;
