const jwt = require("jsonwebtoken");
const { secret } = require("../services/jwt");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token)
    return res.status(401).json({ message: "Authorization token missing" });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
