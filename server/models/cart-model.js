const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    min: 0,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    min: 0,
    max: 9999,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  shopname: {
    type: String,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
