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

GoodSchema.index({ SKU: 1 });

const WarehouseSchema = new mongoose.Schema(
  {
    Warehouse: {
      type: String,
      unique: true,
    },
    Goods: [GoodSchema],
  },
  { versionKey: false }
);

WarehouseSchema.index({ Warehouse: 1 });

const WarehouseModel = mongoose.model("Warehouse", WarehouseSchema);

module.exports = WarehouseModel;
