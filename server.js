const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const db = mongoose.connection.useDb("BW");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const axios = require("axios");
const authRoute = require("./routes").auth;
const productRoute = require("./routes").product;
const passport = require("passport");
require("./config/passport")(passport);
const cartRoute = require("./routes").cart;
const orderRoute = require("./routes").order;
const path = require("path");
const port = process.env.PORT || 8080;
//connect to mongoDB
mongoose
  .connect(process.env.DB_CONNECT, { dbName: "BW" })
  .then(() => {
    console.log("Connect to mongoDB Atlas");
  })
  .catch((e) => {
    console.log(e);
  });
//middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use(express.static(path.join(__dirname, "./frontend/build")));
//觀察req.body
app.use((req, res, next) => {
  console.log("Request body:", req.body);
  next();
});
app.use("/api/user", authRoute);
app.use(
  "/api/products",
  passport.authenticate("jwt", { session: false }),
  productRoute
);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
  });
}
app.listen(port, () => {
  console.log(`Server running on port ${port} .`);
});
