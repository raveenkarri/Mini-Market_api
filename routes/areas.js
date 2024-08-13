const express = require("express");
const router = express.Router();
const multer = require("multer");
const Area = require("../models/Area");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const findArea = async (areaname) => {
  return await Area.findOne({ areaname });
};

const findCategory = (area, category) => {
  return area.categories.find((cat) => cat.category === category);
};

const findShop = (categoryObj, shopname) => {
  return categoryObj.shops.find((shop) => shop.shopname === shopname);
};

router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { areaname, category, shopname, products } = req.body;
    const imageFiles = req.files;

    let area = await findArea(areaname);

    if (!area) {
      area = new Area({
        areaname,
        categories: [
          {
            category,
            shops: [
              {
                shopname,
                products: [{ ...products[0], image: imageFiles[0].path }],
              },
            ],
          },
        ],
      });
    } else {
      let categoryObj = findCategory(area, category);

      if (!categoryObj) {
        area.categories.push({
          category,
          shops: [
            {
              shopname,
              products: [{ ...products[0], image: imageFiles[0].path }],
            },
          ],
        });
      } else {
        let shop = findShop(categoryObj, shopname);

        if (shop) {
          shop.products.push({ ...products[0], image: imageFiles[0].path });
        } else {
          categoryObj.shops.push({
            shopname,
            products: [{ ...products[0], image: imageFiles[0].path }],
          });
        }
      }
    }
    await area.save();
    res.status(201).json(area);
  } catch (error) {
    console.error("Error saving area:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const areas = await Area.find();
    if (!areas) {
      return res.status(404).json({ message: "Areas not found!" });
    }
    res.json(areas);
  } catch (error) {
    console.error("Error fetching areas:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:areaname", async (req, res) => {
  const { areaname } = req.params;
  try {
    const area = await findArea(areaname);
    if (!area) {
      res.status(404).json({ message: "Area not found" });
    }
    res.status(200).json(area);
  } catch (error) {
    console.error("Error fetching area:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:areaname/:category", async (req, res) => {
  const { areaname, category } = req.params;
  try {
    const area = await findArea(areaname);
    if (area) {
      const categoryObj = findCategory(area, category);
      res.json(categoryObj ? categoryObj.shops : []);
    } else {
      res.status(404).json({ message: "Area not found" });
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:areaname/:category/:shopname/:productname?", async (req, res) => {
  const { areaname, category, shopname, productname } = req.params;
  try {
    const area = await findArea(areaname);

    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    const categoryObj = findCategory(area, category);

    if (!categoryObj) {
      return res.status(404).json({ message: "Category not found" });
    }

    const shop = findShop(categoryObj, shopname);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (productname) {
      const product = shop.products.find(
        (product) => product.productname === productname
      );
      if (product) {
        return res.json(product);
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    } else {
      return res.json(shop.products);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
