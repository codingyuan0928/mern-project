const router = require("express").Router();
const Order = require("../models").orderModel;
const Product = require("../models").productModel;

router.use((req, res, next) => {
  console.log("有新請求即將進入API");
  next();
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ buyer: userId }).populate({
      path: "products.product",
      select: ["imgUrl", "title", "description", "shopname"],
    });
    res.status(200).send(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
//這個route怪怪的
router.get("/shop/:shopname", async (req, res) => {
  try {
    const { shopname } = req.params;

    const orders = await Order.find({
      "products.product": {
        $in: await Product.find({ shopname: shopname }).distinct("_id"),
      },
    }).populate({
      path: "products.product",
      match: { shopname: shopname },
      select: [
        "title",
        "price",
        "inventory",
        "shopname",
        "imgUrl",
        "description",
      ],
    });

    if (orders.length === 0) {
      return res.status(404).json({ error: "找不到對應的商品資料" });
    }

    return res.status(200).send(orders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const orderNumber = `ORD-${Date.now()}`;
    const { buyer, products, totalAmount, status } = req.body;
    const orderInstance = new Order({
      orderNumber,
      buyer,
      products,
      totalAmount,
      status,
    });
    const saveOrder = await orderInstance.save();
    res.status(201).json(saveOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.patch("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { "products._id": productId },
      { "products.$.status": status },
      { new: true }
    );

    return res.status(201).json(updatedOrder);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});
module.exports = router;
