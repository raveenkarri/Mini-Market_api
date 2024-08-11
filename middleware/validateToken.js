const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
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
