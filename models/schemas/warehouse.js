const mongoose = require("mongoose");

const SalesAndRemainsSchema = new mongoose.Schema({
  Type: String,
  SalesDate: Date,
  IMEI: String,
  Qty: Number,
});

const GoodSchema = new mongoose.Schema({
  SKU: Number,
  GoodName: String,
  SalesAndRemains: [SalesAndRemainsSchema],
});

const WarehouseSchema = new mongoose.Schema(
  {
    Warehouse: String,
    Goods: [GoodSchema],
  },
  { versionKey: false }
);

const WarehouseModel = mongoose.model("Warehouse", WarehouseSchema);

module.exports = WarehouseModel;
