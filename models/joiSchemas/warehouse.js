const Joi = require("joi");

const salesAndRemainsSchema = Joi.object({
  Type: Joi.string().valid("Продаж", "Залишок").required(),
  SalesDate: Joi.date().iso().required(),
  IMEI: Joi.string().allow("").optional(),
  Qty: Joi.number().integer().min(0).required(),
});

const goodsSchema = Joi.object({
  SKU: Joi.string().required(),
  GoodName: Joi.string().required(),
  SalesAndRemains: Joi.array().items(salesAndRemainsSchema).required(),
});

const warehouseSchema = Joi.object({
  Warehouse: Joi.string().required(),
  Goods: Joi.array().items(goodsSchema).required(),
});

const schema = Joi.array().items(warehouseSchema);

module.exports = schema;
