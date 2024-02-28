const router = require("express").Router();
const Product = require("../models").productModel;
const productValidation = require("../validation").productValidation;

router.use((req, res, next) => {
  console.log("A request is coming into API....");
  next();
});

//查詢req.user
router.get("/test", (req, res) => {
  res.send(req.user);
});

//查詢商品(買、賣家)
router.get("/:category?", async (req, res) => {
  try {
    const { category } = req.params;
    if (category) {
      if (!Product.schema.path("categories").enumValues.includes(category)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid category" });
      }
      const products = await Product.find({ categories: category });
      return res.status(200).json({ success: true, data: products });
    } else {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.per_page) || 15;
      const startIndex = (page - 1) * perPage;
      const endIndex = page * perPage;
      const products = await Product.find({}).skip(startIndex).limit(perPage);
      return res.status(200).json({
        page,
        per_page: perPage,
        data: products,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
});
//買家查詢所有商品
router.get("/shop/:shopname", async (req, res) => {
  const { shopname } = req.params;
  try {
    const products = await Product.find({ shopname: shopname });
    res.status(200).json({ data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
//查詢商品透過名稱
router.get("/findByName/:name", async (req, res) => {
  try {
    let { name } = req.params;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 15;
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const products = await Product.find({ title: name })
      .skip(startIndex)
      .limit(perPage);

    res.status(200).json({
      page,
      per_page: perPage,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
//新增商品(賣家)
router.post("/", async (req, res) => {
  //validate the inputs before building a new product
  const { error } = productValidation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const newProduct = new Product({
    imgUrl: req.body.imgUrl,
    title: req.body.title,
    categories: req.body.categories,
    description: req.body.description,
    inventory: req.body.inventory,
    price: req.body.price,
    buyers: req.body.buyers,
    shopname: req.body.shopname,
  });

  try {
    await newProduct.save();
    res.status(200).send("New product has been saved");
  } catch (err) {
    console.log(err);
    res.status(400).send("Cannot save product");
  }
});

//購買物品(買家)
router.post("/purchase/:productId", async (req, res) => {
  const { productId } = req.params;
  const {
    buyerId,
    buyers: { quantity: quantityToPurchase },
  } = req.body;
  console.log(`productId: ${productId}`);
  console.log(`buyerId: ${buyerId}`);
  console.log(`quantityToPurchase: ${quantityToPurchase}`);

  try {
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const purchaseResult = await product.purchase(buyerId, quantityToPurchase);

    if (purchaseResult.success) {
      return res.status(200).send("Product purchase success");
    } else {
      return res
        .status(400)
        .send(`Product not saved. Reason: ${purchaseResult.message}`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

//取消購買(買家)
router.post("/cancel/:productId", async (req, res) => {
  const { productId } = req.params;
  const {
    buyerId,
    buyers: { quantity: quantityToCancel },
  } = req.body;

  try {
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const cancelResult = await product.cancelPurchase(
      buyerId,
      quantityToCancel
    );

    if (cancelResult.success) {
      return res.status(200).send("Purchase canceled successfully");
    } else {
      return res
        .status(400)
        .send(`Cancel purchase failed. Reason: ${cancelResult.message}`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

//更新商品買家資訊(只有買家可以)
router.patch("/:buyerId/:productId", async (req, res) => {
  const { buyerId, productId } = req.params;
  const { quantity } = req.body;
  try {
    const product = await Product.findOne({ _id: productId });
    const updatedBuyersInfo = { buyerId: buyerId, quantity: quantity };
    const existingBuyer = await Product.findOne({
      _id: productId,
      "buyers.buyerId": buyerId,
    });

    if (existingBuyer) {
      await Product.findOneAndUpdate(
        {
          _id: productId,
          "buyers.buyerId": buyerId,
        },
        {
          $set: {
            "buyers.$.quantity": quantity,
          },
        }
      );
      console.log("buyerId已經存在");
    } else {
      await Product.findOneAndUpdate(
        { _id: productId },
        {
          $addToSet: {
            buyers: updatedBuyersInfo,
          },
        }
      );
      console.log("找不到buyerId");
    }
    res.status(200).send({ success: true, message: "更新成功" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "內部伺服器錯誤" });
  }
});

//刪除商品(只有該賣家可以)
router.delete("/:productId", async (req, res) => {
  let { productId } = req.params;

  try {
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).send({ success: false, message: "找不到產品" });
    }
    if (product.shopname === req.user.seller.shopname) {
      await Product.deleteOne({ _id: productId });
      res.status(200).send("產品刪除成功");
    } else {
      res.status(403).json({
        success: false,
        message: "只有該產品的賣家可以刪除刪除此產品",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "內部伺服器錯誤" });
  }
});

module.exports = router;
