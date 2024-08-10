const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const areaRoutes = require("./routes/areas");
const customerRoutes = require("./routes/customer");

const app = express();
const PORT = 5005;

// Connect to MongoDBkkk
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

// Middleware
app.use(
  cors({
    origin: "https://mini-market-blue.vercel.app",
    methods: "GET,POST,PUT,DELETE", // Allowed methods
    credentials: true,
  })
); // Add CORS support
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/areas", areaRoutes);
app.use("/customers", customerRoutes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
