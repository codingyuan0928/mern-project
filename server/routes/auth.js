const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

router.use((req, res, next) => {
  console.log("A request is coming in auth.js");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working",
  };
  return res.json(msgObj);
});

router.post("/register", async (req, res) => {
  // check the validation of data
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // check if the user exists
  const emailExist = await User.findOne({
    "buyer.email": req.body.buyer.email,
  });
  if (emailExist) {
    return res.status(400).send("Email has already been registered.");
  }
  // register the user
  const newUser = new User({
    buyer: {
      avatarUrl: req.body.buyer.avatarUrl,
      username: req.body.buyer.username,
      password: req.body.buyer.password,
      email: req.body.buyer.email,
      name: req.body.buyer.name,
      address: req.body.buyer.address,
      sex: req.body.buyer.sex,
    },
    seller: {
      sellerAvatarUrl: req.body.seller.sellerAvatarUrl || null,
      shopname: req.body.seller.shopname || null,
    },
  });
  try {
    const savedUser = await newUser.save();
    const buyer = await User.findOne({ _id: newUser.id });
    console.log(buyer);
    res.status(200).send({
      msg: "success",
      savedObject: savedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).send(err.message);
  }
});
router.patch("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const { buyer } = req.body;
    const databaseUser = await User.findOne({ "buyer.email": buyer.email });
    if (!databaseUser) {
      return res.status(400).send("User not found!");
    }
    //使用深度對比來確定物件完全相同
    const databaseBuyer = databaseUser.buyer.toObject();
    delete databaseBuyer.password;
    delete buyer.password;
    const isMatch = _.isEqual(databaseBuyer, buyer);

    if (isMatch) {
      databaseUser.seller = req.body.seller;
      await databaseUser.save();
      return res.status(200).send("賣家資料更新成功");
    } else {
      console.error("Buyer data mismatch:", { databaseBuyer, buyer });
      return res.status(400).send("買家資料有誤，故無法儲存賣場資訊");
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//login
router.post("/login", (req, res) => {
  //check the validation of data
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  User.findOne({ "buyer.email": req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).send("User not found!!");
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (err) {
            return res.status(400).send(err);
          }
          if (isMatch) {
            const tokenObject = { _id: user._id, email: user.buyer.email };
            const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
            res.send({ success: true, token: "JWT " + token, user });
          } else {
            res.status(401).send("Wrong password.");
          }
        });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
