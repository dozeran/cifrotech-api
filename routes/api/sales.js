const express = require("express");
const router = express.Router();

const { wrapper } = require("../../helpers");
const method = require("../../controllers");

router.get("/", wrapper(method.getSales));

module.exports = router;
