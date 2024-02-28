const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  imgUrl: { type: String, required: true },
  title: { type: String, minlength: 6, maxlength: 50, required: true },
  categories: {
    type: String,
    enum: [
      "優惠&精選",
      "雜貨",
      "服鞋&配飾",
      "電子產品",
      "電子遊戲",
      "家俱&家電",
      "玩具",
      "嬰兒",
      "汽車&輪胎",
      "電影",
      "書籍",
      "藥物&健康",
      "個人護理",
      "美妝",
      "寵物",
      "家務&居家",
      "運動&戶外",
      "學校&辦公",
      "派對&節慶",
      "藝術&音樂",
      "禮品",
      "其他",
    ],
    required: true,
  },
  description: {
    type: String,
    maxlength: 150,
    required: true,
  },
  inventory: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    min: 0,
    max: 9999,
    required: true,
  },
  buyers: [
    {
      buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      quantity: {
        type: Number,
        min: 0,
      },
    },
  ],
  shopname: {
    type: String,
    unique: true,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
});

// 購買商品的方法，整合自你的 purchase 方法和我的示例
productSchema.methods.purchase = async function (buyerId, quantity) {
  try {
    if (this.inventory >= quantity && quantity > 0) {
      // 新增即時更新 sold 屬性
      this.sold += quantity;

      // 如果 this.buyers 不存在或为空数组，则初始化为一个包含新的 buyer 的数组
      if (!this.buyers || this.buyers.length === 0) {
        this.buyers = [
          {
            buyerId: buyerId,
            quantity: quantity,
          },
        ];
      } else {
        const existingBuyer = this.buyers.find(
          (buyer) => buyer && buyer.buyerId && buyer.buyerId.equals(buyerId)
        );

        if (existingBuyer) {
          existingBuyer.quantity += quantity;
        } else {
          this.buyers.push({
            buyerId: buyerId,
            quantity: quantity,
          });
        }
      }

      this.inventory -= quantity;

      // 新增庫存更新後的保存並返回 Promise
      return this.save().then((updatedProduct) => {
        console.log("Updated product:", updatedProduct);
        return {
          success: true,
          message: "Product purchase success",
          product: updatedProduct,
        };
      });
    } else {
      // 在无法购买的情况下，返回一个包含详细信息的对象
      const errorMessage =
        this.inventory < quantity
          ? "Insufficient inventory."
          : "Invalid quantity.";

      return Promise.resolve({ success: false, message: errorMessage });
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to purchase product",
    };
  }
};

// 取消購買商品的方法，整合自我的 cancelPurchase 方法
productSchema.methods.cancelPurchase = async function (
  buyerId,
  quantityToCancel
) {
  try {
    // 检查取消的数量是否有效
    if (this.sold < quantityToCancel) {
      return {
        success: false,
        message: "Invalid quantity to cancel",
      };
    }

    // 恢复库存和销售量
    this.inventory += quantityToCancel;
    this.sold -= quantityToCancel;

    // 移除购买者信息
    this.buyers = this.buyers.filter(
      (buyer) => buyer.buyerId && !buyer.buyerId.equals(buyerId)
    );

    // 保存更新後的商品信息
    await this.save();

    return {
      success: true,
      message: "Purchase canceled successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to cancel purchase",
    };
  }
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
