const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader) {
      return res.status(404).json({ message: "Token not created" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.json({ message: "token not available" });
    }

    jwt.verify(token, process.env.API_SECRETE_KEY, (err, decode) => {
      if (err) {
        res.json({ message: "Error Token" });
      }
      req.user = decode.user;

      next();
    });
  } catch (err) {
    console.log(err);
    res.json({ message: "token valildation error" });
  }
};

module.exports = validateToken;
