import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import cartsService from "../services/carts.service";
import productsService from "../services/products.service";
import ordersService from "../services/orders.service";
import LoadingC from "./Loading-component";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

const ShoppingCartComponent = ({ currentUser }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shopChecked, setShopChecked] = useState({});
  const [itemChecked, setItemChecked] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkoutClicked, setCheckoutClicked] = useState(false);
  const [Loading, setLoading] = useState(true);
  const history = useHistory();
  const userId = currentUser._id;

  // paypal支付
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const initialOptions = {
    "client-id":
      "AUf0C7tKNMaLHS-OVLirRFAzDC2jgaX4GAn8p0tQhvplGf31eL1Tdh9a0mezJ92J4mo1ODmD9RqqVXB6",
    currency: "TWD",
    intent: "capture",
  };

  const onCreateOrder = (orderData, actions) => {
    const num = JSON.parse(localStorage.getItem("totalPrice")) ?? 0;
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: num,
          },
        },
      ],
    });
  };

  const onApproveOrder = (approveData, actions) => {
    return actions.order.capture().then(() => {
      localStorage.removeItem("totalPrice");
      alert(`購買已完成即將為您導向個人頁面`);
      history.push("/profile");
    });
  };

  // 獲取cart資訊
  useEffect(() => {
    getCartItems();
  }, []);

  const getCartItems = () => {
    setCartItems([]);
    cartsService
      .getCartItems(userId)
      .then((response) => {
        const updatedCartItems = response.data.map((cart) => {
          return {
            ...cart,
            items: groupByShopname(cart.items),
          };
        });
        setCartItems(updatedCartItems);
        forceUpdate();
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          // 如果是 404 錯誤，表示購物車為空，可以顯示提示文字
          forceUpdate();
          setLoading(false);
        } else {
          // 如果是其他錯誤，請在控制台顯示錯誤信息
          console.error("Error fetching cart items:", err);
        }
      });
  };

  //react強制手動渲染
  const forceUpdate = () => {
    setCartItems((prev) => [...prev]);
  };
  const deleteCartItem = (userId, shopname, productId) => {
    cartsService
      .delete(userId, shopname, productId)
      .then(() => {
        window.alert("已刪除該筆購物車資料");
        getCartItems();
      })
      .catch((err) => {
        console.log("Error deleting cart item:", err);
        if (err.response) {
          console.log("Server responded with:", err.response.data);
        } else if (err.request) {
          console.log("No response received:", err.request);
        } else {
          console.log("Error setting up the request:", err.message);
        }
      });
  };

  // 將購物車項目分組，以 SHOPNAME 為 key
  const groupByShopname = (items) => {
    const groupedItems = {};
    items.forEach((item) => {
      const shopname = item.shopname;
      if (!groupedItems[shopname]) {
        groupedItems[shopname] = [];
      }
      groupedItems[shopname].push(item);
    });
    return groupedItems;
  };

  const handleInputChange = (productId, newQuantity) => {
    // 將商品的新數量設定到購物車項目中
    const updatedCartItems = cartItems.map((cart) => {
      const updatedItems = Object.entries(cart.items).reduce(
        (acc, [shopname, products]) => {
          const updatedProducts = products.map((product) => {
            if (product._id === productId) {
              return {
                ...product,
                quantity: newQuantity,
              };
            }
            return product;
          });
          return {
            ...acc,
            [shopname]: updatedProducts,
          };
        },
        {}
      );
      return {
        ...cart,
        items: updatedItems,
      };
    });
    setCartItems(updatedCartItems);
  };

  const handleShopCheckboxChange = (shopname) => {
    setShopChecked((prevShopChecked) => {
      const newShopChecked = {
        ...prevShopChecked,
        [shopname]: !prevShopChecked[shopname],
      };
      if (newShopChecked[shopname]) {
        cartItems.forEach((cart) => {
          Object.entries(cart.items).forEach(([currentShopname, products]) => {
            if (currentShopname === shopname) {
              products.forEach((product) => {
                setItemChecked((prevItemChecked) => ({
                  ...prevItemChecked,
                  [product._id]: true,
                }));
              });
            }
          });
        });
      } else {
        cartItems.forEach((cart) => {
          Object.entries(cart.items).forEach(([currentShopname, products]) => {
            if (currentShopname === shopname) {
              products.forEach((product) => {
                setItemChecked((prevItemChecked) => ({
                  ...prevItemChecked,
                  [product._id]: false,
                }));
              });
            }
          });
        });
      }
      return newShopChecked;
    });
  };

  useEffect(() => {
    if (selectAllChecked) {
      const isAnyProductUnchecked = Object.values(itemChecked).some(
        (isChecked) => !isChecked
      );
      setSelectAllChecked(!isAnyProductUnchecked);
    }

    cartItems.forEach((cart) => {
      Object.keys(cart.items).forEach((shopname) => {
        if (!shopChecked[shopname]) {
          const isAnyProductChecked = cart.items[shopname].some(
            (product) => itemChecked[product._id]
          );

          setShopChecked((prevShopChecked) => {
            return {
              ...prevShopChecked,
              [shopname]: isAnyProductChecked,
            };
          });
        } else {
          const isAllProductsUnchecked = cart.items[shopname].every(
            (product) => !itemChecked[product._id]
          );

          if (isAllProductsUnchecked) {
            setShopChecked((prevShopChecked) => {
              return {
                ...prevShopChecked,
                [shopname]: false,
              };
            });
          }
        }
      });
    });
  }, [itemChecked, setShopChecked]);
  useEffect(() => {
    console.log(itemChecked);
  }, [itemChecked]);
  const handleItemCheckboxChange = (productId) => {
    setItemChecked((prevItemChecked) => ({
      ...prevItemChecked,
      [productId]: !prevItemChecked[productId],
    }));
    console.log(itemChecked);
  };

  const isShopChecked = (cart, shopname) => {
    return shopChecked[shopname] || false;
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((cart) => {
      Object.entries(cart.items).forEach(([shopname, products]) => {
        products.forEach((product) => {
          const productId = product._id;

          if (itemChecked[productId]) {
            totalPrice += product.price * product.quantity;
          }
        });
      });
    });
    localStorage.setItem("totalPrice", totalPrice);
    return totalPrice;
  };

  const handleCheckOutClick = () => {
    setCheckoutClicked(true);
  };
  const handlePurchaseProducts = () => {
    const status = "待出貨";
    const totalPrice = JSON.parse(localStorage.getItem("totalPrice"));
    const orderItems = [];
    cartItems.forEach((cart) => {
      Object.entries(cart.items).forEach(([shopname, products]) => {
        products.forEach((product) => {
          //該購物車的id
          const checkedCartId = product._id;
          const productId = product.product._id;
          if (itemChecked[checkedCartId]) {
            console.log(`Product ID ${productId} is checked.`);
            //這裡的productId是商品號
            //1.將購物車資料建入商品實例
            productsService
              .purchaseProduct(productId, userId, product.quantity)
              .then(() => {
                console.log("順利購買");
              })
              .catch((err) => {
                console.log(err);
              });
            //2.將該購物車清空
            cartsService
              .delete(userId, shopname, productId)
              .then(() => {
                console.log("已刪除該筆購物車資料");
              })
              .catch((err) => {
                console.log("Error deleting cart item:", err);
              });
            //3.建立order資料
            orderItems.push({
              product: productId,
              quantity: product.quantity,
              unitPrice: product.price,
              status: "待出貨",
            });
          }
        });
      });
    });
    if (orderItems.length > 0) {
      ordersService
        .createOrder(userId, orderItems, totalPrice, status)
        .then(() => {
          console.log("已成功建立order");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const totalPriceStyle = {
    position: "relative",
    top: "0rem",
    width: "15rem",
    left: "2vw",
    marginRight: "1rem",
  };
  if (!Loading) {
    return (
      <div style={{ height: "45vh" }}>
        <div className="empty-cart-message" style={{ fontSize: "2rem" }}>
          您的購物車目前是空的，請再接再厲(ง๑ •̀_•́)ง!!
        </div>
      </div>
    );
  }
  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="sc-page" style={{ minHeight: "100vh" }}>
        {cartItems.length === 0 ? (
          <LoadingC />
        ) : (
          <div>
            {" "}
            <div className="title-block">
              <div className="product">商品</div>
              <div className="price">單價</div>
              <div className="number">數量</div>
              <div className="total-unit">總計</div>
              <div className="composing"></div>
            </div>
            {cartItems && (
              <div>
                {cartItems.map((cart) => (
                  <div key={cart._id}>
                    {Object.entries(cart.items).map(([shopname, products]) => (
                      <div key={shopname}>
                        <div className="shop-name-block">
                          <div className="shop-name">
                            <input
                              type="checkbox"
                              checked={isShopChecked(cart, shopname)}
                              onChange={() =>
                                handleShopCheckboxChange(shopname)
                              }
                            />
                            <i className="fi fi-rs-store-alt"></i>:
                            <span>{shopname}</span>
                          </div>
                        </div>
                        {products.map((itemOfSingleCart) => (
                          <div key={itemOfSingleCart._id}>
                            <div className="ordered-list">
                              <input
                                className="checkbox"
                                type="checkbox"
                                checked={
                                  itemChecked[itemOfSingleCart._id] || false
                                }
                                onChange={() =>
                                  handleItemCheckboxChange(itemOfSingleCart._id)
                                }
                              />
                              <img
                                src={
                                  itemOfSingleCart.product &&
                                  itemOfSingleCart.product.imgUrl
                                }
                                alt="商品圖片"
                                className="product-img"
                              />
                              <div className="product-title">
                                {itemOfSingleCart.product &&
                                  itemOfSingleCart.product.title}
                              </div>
                              <div className="product-unit-price">
                                {itemOfSingleCart.price}
                              </div>
                              <div className="product-number-group">
                                <button
                                  className="minus"
                                  onClick={() =>
                                    handleInputChange(
                                      itemOfSingleCart._id,
                                      Math.max(
                                        parseInt(
                                          itemOfSingleCart.quantity,
                                          10
                                        ) - 1,
                                        1
                                      )
                                    )
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={itemOfSingleCart.quantity}
                                  onChange={(e) =>
                                    handleInputChange(
                                      itemOfSingleCart._id,
                                      Math.max(parseInt(e.target.value, 10), 1)
                                    )
                                  }
                                />
                                <button
                                  className="plus"
                                  onClick={() =>
                                    handleInputChange(
                                      itemOfSingleCart._id,
                                      parseInt(itemOfSingleCart.quantity, 10) +
                                        1
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <div className="product-price">
                                $
                                {itemOfSingleCart.quantity *
                                  itemOfSingleCart.price}
                              </div>
                              <div className="delete-div">
                                <FaRegTrashCan
                                  className="delete"
                                  onClick={() =>
                                    deleteCartItem(
                                      userId,
                                      shopname,
                                      itemOfSingleCart.product._id
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <div className="last-block">
              <div className="payment-group">
                <div
                  className="total-price"
                  style={checkoutClicked ? {} : totalPriceStyle}
                >
                  總計額
                  <span>${calculateTotalPrice()}</span>
                </div>
                {!checkoutClicked ? (
                  <button className="pay-button" onClick={handleCheckOutClick}>
                    去買單
                  </button>
                ) : (
                  <div className="checkout">
                    {isPending ? (
                      <p>LOADING...</p>
                    ) : (
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          color: "black",
                        }}
                        disabled={localStorage.getItem("totalPrice") === "0"}
                        createOrder={(orderData, actions) =>
                          onCreateOrder(orderData, actions)
                        }
                        onApprove={(approveData, actions) => {
                          onApproveOrder(approveData, actions);
                          handlePurchaseProducts();
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default ShoppingCartComponent;
