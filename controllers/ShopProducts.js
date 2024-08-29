const Shop = require("../models/ShopModel");

const addProduct = async (req, res) => {
  try {
    const { productname, cost, description, imageUrl } = req.body;
    const shopid = req.userShop.id;
    if (!shopid) {
      return res.status(400).json({ message: "shop Id not found" });
    }
    const shop = await Shop.findOne({ _id: shopid });
    if (!shop) {
      return res.status(404).json({ message: "shop not found" });
    }
    shop.products.push({
      productname,
      cost,
      description,
      imageUrl,
    });

    await shop.save();
    res.status(200).json(shop.products);
  } catch (error) {
    return res.status(500).json({ message: "Error from server", error });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const id = req.userShop.id;
    const productid = req.params.id;
    let shop = await Shop.findOne({ _id: id });
    if (!shop) {
      return res.status(404).json({ message: "shop not found" });
    }
    shop.products = shop.products.filter(
      (product) => product._id.toString() !== productid
    );

    await shop.save();
    res.status(200).json({ message: "Delete successful", shop: shop.products });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { productname, cost, description, imageUrl } = req.body;
    const id = req.userShop.id;
    const productid = req.params.id;
    let shop = await Shop.findOne({ _id: id });
    if (!shop) {
      return res.status(404).json({ message: "shop not found" });
    }
    const index = shop.products.findIndex(
      (product) => product._id.toString() === productid
    );
    if (index === -1) {
      return res.json({ message: "Contact not found" });
    }
    shop.products[index] = { productname, cost, description, imageUrl };

    await shop.save();
    res.status(200).json({ message: "updated successful", shop: shop });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};

module.exports = { addProduct, deleteProduct, updateProduct };
