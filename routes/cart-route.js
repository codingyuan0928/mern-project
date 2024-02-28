const router = require("express").Router();
const Cart = require("../models").cartModel;
const cartValidation = require("../validation").cartValidation;
const Product = require("../models").productModel;

router.use("/", (req, res, next) => {
  console.log("A request is coming into cart API");
  next();
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const carts = await Cart.find({ userId }).populate({
      path: "items.product",
      select: ["imgUrl", "title"],
    });

    if (!carts || carts.length === 0) {
      return res.status(404).send("使用者尚未創建該購物車");
    }

    res.status(200).send(carts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//新增產品資料至購物車
router.post("/:userId/:shopname/:productId", async (req, res) => {
  const { userId, shopname, productId } = req.params;
  const { quantity, price } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: "Product not found!" });
    }
    if (product.shopname !== shopname) {
      return res
        .status(400)
        .json({ error: "productId does not match with shopname!" });
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart();
      cart.userId = userId;
    }
    //利用findIndex去尋找比對ArrayofObjects中相同productId以及相同shopname的物件
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.equals(productId) && item.shopname === shopname
    );
    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity = quantity;
      if (cart.items[existingItemIndex].quantity > product.inventory) {
        return res.status(400).json({ error: "商品數量超過庫存數量" });
      }
      cart.items[existingItemIndex].totalPrice =
        cart.items[existingItemIndex].quantity * price;
    } else {
      const totalPrice = quantity * price;
      const newCartItem = {
        product: productId,
        quantity: quantity,
        price: price,
        totalPrice: totalPrice,
        shopname: shopname,
      };
      cart.items.push(newCartItem);
    }
    await cart.save();
    const updatedCart = await Cart.findOne({ userId });
    res.status(200).json({
      message: "Product added to cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//更改購物車內資料，若數量歸零則自動刪除
router.patch("/:userId/:shopname/:productId", async (req, res) => {
  const { error } = cartValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { userId, shopname, productId } = req.params;
  const { quantity, price } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: "Product not found!" });
    }
    if (product.shopname !== shopname) {
      return res
        .status(400)
        .json({ error: "productId does not match with shopname!" });
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(400)
        .send({ success: false, message: "cart does not exist yet!!" });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.equals(productId) && item.shopname === shopname
      );
      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity = quantity;
        cart.items[existingItemIndex].totalPrice =
          cart.items[existingItemIndex].quantity * price;
        if (cart.items[existingItemIndex].quantity > product.inventory) {
          return res.status(400).json({ error: "庫存數量不足以購買" });
        }
        if (cart.items[existingItemIndex].quantity === 0) {
          cart.items.splice(existingItemIndex, 1);
          if (cart.items.length === 0) {
            await cart.deleteOne();
            return res.send({ success: true, message: "成功刪除購物車" });
          }
          await cart.save();
          return res.status(200).json({ message: "成功刪除購物車內的產品" });
        } else {
          await cart.save();
          return res
            .status(200)
            .json({ message: "cart updated quantity successfully" });
        }
      } else {
        return res.status(400).json({
          message: "目前尚未該購物車尚未有相關產品資料，故而無法調整數量!",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//刪除購物車內資料
router.delete("/:userId/:shopname/:productId", async (req, res) => {
  const { userId, shopname, productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: "Product not found!" });
    }
    if (product.shopname !== shopname) {
      return res
        .status(400)
        .json({ error: "productId does not match with shopname!" });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .send({ success: false, message: "購物車內找不到該產品" });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.equals(productId) && item.shopname === shopname
      );
      cart.items.splice(existingItemIndex, 1);
      if (cart.items.length === 0) {
        await cart.deleteOne();
        return res.send({ success: true, message: "成功刪除購物車" });
      }
      await cart.save();
      return res.status(200).json({ message: "成功刪除購物車內的產品" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "內部伺服器錯誤" });
  }
});

module.exports = router;
