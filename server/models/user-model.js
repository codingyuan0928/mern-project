const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  buyer: {
    avatarUrl: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
    email: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 100,
    },
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    sex: {
      type: String,
      enum: ["男性", "女性", "其他"],
      required: true,
    },
  },
  seller: {
    sellerAvatarUrl: {
      type: String,
    },
    shopname: {
      type: String,
      minlength: 6,
      maxlength: 50,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//mongoose schema middleware
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const hash = await bcrypt.hash(this.buyer.password, 10);
    this.buyer.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.buyer.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
