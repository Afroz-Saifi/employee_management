const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1] || false;
    if (!token) {
      throw new Error("Authentication failed, please login first!");
      return;
    }
    const decode = jwt.decode(token, process.env.access_token);
    if (!decode) {
      throw new Error("Authentication failed, please login first!");
      return;
    }
    const { email, id } = decode;
    req.user = { email, id };
    return next();
  } catch (error) {
    return res.status(404).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = { authentication };
