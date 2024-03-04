const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    device: {
      type: String,
      required: true,
    },
    imei: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const saleModel = mongoose.model("Sale", saleSchema);

module.exports = saleModel;
