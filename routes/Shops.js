const express = require("express");
const {
  addShop,
  getAllShops,
  getShop,
  loginShop,
  getShopByAreaname,
} = require("../controllers/ShopController");
const validateShopToken = require("../middleware/validateShopToken");
const {
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/ShopProducts");

const router = express.Router();

router.post("/addshop", addShop);

router.post("/loginshop", loginShop);

router.get("/myshop", validateShopToken, getShop);

router.get("/", getAllShops);

router.get("/:area?/:category?/:shopname?", getShopByAreaname);
//products routes
router.post("/addproduct", validateShopToken, addProduct);

router.delete("/deleteproduct/:id", validateShopToken, deleteProduct);

router.put("/updateproduct/:id", validateShopToken, updateProduct);

module.exports = router;
