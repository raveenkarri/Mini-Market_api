const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
      res.json({ message: "token not found" });
    }
    const token = authHeader.split(" ")[1];
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
