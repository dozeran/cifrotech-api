const { newError } = require("../helpers");

function checkApiKey(req, res, next) {
  if (req.query.key !== process.env.API_KEY) {
    return next(newError(401, "Not authorized"));
  }

  next();
}

module.exports = checkApiKey;
