const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  productname: { type: String },
  cost: { type: Number },
  description: { type: String },
});
const customerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cartProducts: [cartSchema],
});

module.exports = mongoose.model("Customer", customerSchema);
