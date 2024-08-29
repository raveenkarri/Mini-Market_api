require("dotenv").config();
const express = require("express");
const ImageKit = require("imagekit");
const bodyParser = require("body-parser");
const cors = require("cors");

const ShopRoutes = require("./routes/Shops");
const customerRoutes = require("./routes/customer");
const dbConnection = require("./mongoDb/Dbconnection");
dbConnection();

const app = express();
const PORT = 5005;

const imagekit = new ImageKit({
  urlEndpoint: "https://ik.imagekit.io/fsbc1hx6u",
  publicKey: "public_Fz5mhywWLJl5zB0i0lISiFEsUYM=",
  privateKey: "private_C7WaH5AyQZ582gPofJcCMZRTc0I=",
});

//allow cross-origin requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/auth", function (req, res) {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
});
app.use(cors());

app.use(bodyParser.json());

// Routes
app.use("/shops", ShopRoutes);
app.use("/customers", customerRoutes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
