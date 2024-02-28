const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      //之後如果做促銷系統，就可以透過這邊查出已購價格跟線售價格的差異
      unitPrice: { type: Number, required: true },
      status: {
        type: String,
        enum: ["待出貨", "待收貨", "已完成", "退款/退貨"],
        default: "待出貨",
      },
    },
  ],
  totalAmount: { type: Number, required: true },
  purchaseTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
