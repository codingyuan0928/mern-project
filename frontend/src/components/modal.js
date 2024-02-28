import React, { useState, useEffect } from "react";
import cartsService from "../services/carts.service";
import { useHistory } from "react-router-dom";
import productsService from "../services/products.service";

const Modal = ({
  open,
  onClose,
  data,
  quantity,
  setQuantity,
  handleQuantityChange,
  currentUser,
  identity,
}) => {
  const history = useHistory();

  if (!open || !data) return null;

  const postCarts = async () => {
    const productId = data._id;
    const price = data.price;
    const shopname = data.shopname;
    const userId = currentUser._id;
    console.log(userId, shopname, productId, quantity, price);
    if (identity == "seller") {
      window.alert("請切換成買家身分");
    } else if (identity == "visitor") {
      window.alert("請先登入以查看購物車");
      document.body.style.overflow = "auto";
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.push("/login");
    } else {
      //post carts邏輯!!
      cartsService
        .post(userId, shopname, productId, quantity, price)
        .then(() => {
          window.alert("成功更新購物車資料");
        })
        .catch((err) => {
          window.alert(err);
        });
    }
  };

  return (
    <div className="overlay">
      <div className="modalContainer">
        {/* 使用 data 作為資料來源 */}
        <img src={data.imgUrl} alt="" className="modal-img" />
        <div className="modalRight">
          <p className="closeBtn" onClick={onClose}>
            X
          </p>
          <div className="content">
            <h1 style={{ fontWeight: "500", fontSize: "2.5rem" }}>
              {data.title}
            </h1>

            <div
              style={{
                backgroundColor: "rgba(128,128,128,0.1)",
                paddingLeft: "1rem",
                margin: "1.5rem 0rem",
              }}
            >
              <h2
                style={{
                  margin: "1.5rem 0rem",
                  color: "red",
                  fontSize: "2rem",
                }}
              >
                ${data.price}
              </h2>
            </div>

            <h3
              style={{
                fontSize: "1.5rem",
                margin: "1.5rem 0rem",
                paddingLeft: "1rem",
              }}
            >
              運送：免運費
            </h3>
            <div
              style={{ margin: "1.5rem 0rem 1.5rem 0.5rem" }}
              className="quantity-inventory-group"
            >
              <div
                className="product-number-group"
                style={{
                  border: "1px solid rgba(128,128,128,0.3)",
                  display: "inline-block",
                  marginRight: "1.25rem",
                }}
              >
                <button
                  className=" minus"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(parseInt(e.target.value, 10), data.inventory)
                    )
                  }
                />
                <button
                  className="plus"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
              <div
                style={{
                  fontSize: "1.25rem",
                  color: "rgba(128,128,128,0.9)",
                }}
                className="inventory"
              >
                還剩下{data.inventory}件
              </div>
            </div>
          </div>
          <div className="btnContainer">
            <button className="btnPrimary" onClick={postCarts}>
              <span className="bold">購買</span>, 放入購物車
            </button>
            <button className="btnOutline" onClick={onClose}>
              <span className="bold">取消</span>, 再逛逛
            </button>
          </div>
          <h3
            style={{
              fontSize: "1.25rem",
              margin: "1.5rem 0rem",
              paddingLeft: "1rem",
            }}
          >
            【產品描述】
          </h3>
          <h3
            style={{
              fontSize: "1.25rem",
              margin: "1rem 0rem 1rem 0rem",
              paddingLeft: "1.25rem",
            }}
          >
            {data.description}
          </h3>
          <div style={{ width: "15vw", height: "1.2rem" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
