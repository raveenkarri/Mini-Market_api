const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productname: { type: String },
  cost: { type: Number },
  description: { type: String },
  imageUrl: { type: String },
});

const shopSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  areaname: { type: String, required: true },
  category: { type: String, required: true },
  shopname: { type: String, required: true },
  shopImage: { type: String },
  products: [productSchema],
});

module.exports = mongoose.model("Shops", shopSchema);
