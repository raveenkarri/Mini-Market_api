const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected to :" + connection.connection.name);
  } catch (error) {
    if (error) {
      console.log("Database not connected");
      process.exit(1);
    }
  }
};
module.exports = dbConnection;
