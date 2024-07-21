const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productname: { type: String, required: true },
  cost: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String }
});

const shopSchema = new mongoose.Schema({
  shopname: { type: String, required: true },
  products: [productSchema]
});

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  shops: [shopSchema]
});

const areaSchema = new mongoose.Schema({
  areaname: { type: String, required: true },
  categories: [categorySchema]
});

module.exports = mongoose.model('Area', areaSchema);
