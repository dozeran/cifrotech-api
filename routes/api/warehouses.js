const express = require("express");
const router = express.Router();

const { wrapper } = require("../../helpers");
const method = require("../../controllers");
const { validateSchema } = require("../../middlewares");
const schema = require("../../models/joiSchemas/warehouse");

router.get("/", wrapper(method.getWarehouses));

router.post("/", validateSchema(schema), wrapper(method.updateWarehouses));

module.exports = router;
