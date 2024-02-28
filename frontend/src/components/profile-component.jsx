import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ordersService from "../services/orders.service";
import productsService from "../services/products.service";
//日期格式功能
function formatDate(purchaseTime) {
  const date = new Date(purchaseTime);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const ProfileComponent = ({ identity, currentUser, setCurrentUser }) => {
  // little nav bar部分
  let [activeLink, setActiveLink] = useState("全部");
  const [orders, setOrders] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [sellerOrders, setSellerOders] = useState([]);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [, forceUpdate] = useState();
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  useEffect(() => {
    setActiveLink("全部");
    console.log(currentUser);
    handleBuyerOrderAcquire();
    handleSellerProductsAcquire();
    handleSellerOrderAcquire();
    // 啟動定時刷新
    const intervalId = setInterval(() => {
      // 在這裡執行需要定時刷新的內容
      handleBuyerOrderAcquire();
      handleSellerOrderAcquire();
    }, 5000); // 每30秒刷新一次，你可以根據實際需求調整時間

    // 將 intervalId 存儲在狀態中，以便在組件卸載時清理
    setRefreshInterval(intervalId);

    // 組件卸載時清理 interval
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  //option-list部分
  let [OptionList, setOptionList] = useState("購物清單");

  useEffect(() => {
    if (identity === "buyer") {
      setOptionList("購物清單");
      setActiveLink("全部");
    } else if (identity === "seller") {
      setOptionList("賣家中心");
      setActiveLink("商品");
    }
  }, [identity]);
  const handleOptionClick = (activate, event) => {
    // 阻止默認行為
    if (
      (identity === "buyer" &&
        (activate === "賣家中心" || activate === "新增商品")) ||
      (identity === "seller" &&
        (activate === "購物清單" || activate === "購物車"))
    ) {
      event.preventDefault();
      alert("請先切換成正確的身分");
      return;
    }
  };

  const numProducts = productsData.length;
  const numPendingShipments = sellerOrders.reduce(
    (count, order) =>
      count +
      order.products.filter((product) => product.status === "待出貨").length,
    0
  );

  //獲取order資訊
  const handleBuyerOrderAcquire = () => {
    const userId = currentUser._id;
    ordersService
      .getBuyerOrder(userId)
      .then((ordersData) => {
        console.log("成功獲取買家order");
        console.log(ordersData);
        setOrders(ordersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSellerOrderAcquire = () => {
    const shopname = currentUser.seller.shopname;
    ordersService
      .getSellerOrder(shopname)
      .then((response) => {
        console.log("成功獲取賣家訂單資料");
        console.log(`賣家訂單資料:`, response);
        setSellerOders(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSellerProductsAcquire = () => {
    const shopname = currentUser.seller.shopname;
    productsService
      .acquireProductsByShopname(shopname)
      .then((response) => {
        console.log("成功獲取賣家商品資料");
        setProductsData(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleStatusChange = (productId) => {
    console.log("Button clicked!");
    let newStatus = "";
    let targetOrder; // 用於存放目標訂單

    // 根據身分判斷是買家還是賣家
    if (identity === "buyer") {
      targetOrder = orders.find((order) =>
        order.products.some((product) => product._id === productId)
      );
    } else if (identity === "seller") {
      targetOrder = sellerOrders.find((order) =>
        order.products.some((product) => product._id === productId)
      );
    }

    // 判斷目標訂單是否存在，以及是否包含該商品
    if (targetOrder && targetOrder.products) {
      const targetProduct = targetOrder.products.find(
        (product) => product._id === productId
      );

      if (targetProduct) {
        if (targetProduct.status === "待出貨") {
          newStatus = "待收貨";
        } else if (targetProduct.status === "待收貨") {
          newStatus = "已完成";
        } else {
          newStatus = "退貨/退款";
        }
      }
    }
    console.log(`Updating status for product ${productId} to ${newStatus}`);
    if (newStatus) {
      ordersService
        .updateStatus(productId, newStatus)
        .then((response) => {
          console.log("成功更改商品狀態");
          console.log(response);
          //重新獲取訂單
          handleBuyerOrderAcquire();
          handleSellerOrderAcquire();
          //強制ui重新渲染
          forceUpdate({});
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="profile" style={{ height: "100vh" }}>
      <div className="section-left">
        <p className="sl">
          <Link
            to="#"
            onClick={(e) => handleOptionClick("購物清單", e)}
            className={`link  ${OptionList === "購物清單" ? "activate" : ""}`}
          >
            購物清單
          </Link>
        </p>
        <p className="sc">
          <Link
            to="/shoppingCart"
            onClick={(e) => handleOptionClick("購物車", e)}
            className={`link  ${OptionList === "購物車" ? "activate" : ""}`}
          >
            購物車
          </Link>
        </p>
        <p className="ss">
          <Link
            to="#"
            onClick={(e) => handleOptionClick("賣家中心", e)}
            className={`link  ${OptionList === "賣家中心" ? "activate" : ""}`}
          >
            賣家中心
          </Link>
        </p>
        <p className="up">
          <Link
            to="/updateProducts"
            onClick={(e) => handleOptionClick("新增商品", e)}
            className={`link  ${OptionList === "新增商品" ? "activate" : ""}`}
          >
            新增商品
          </Link>
        </p>
      </div>
      <div className="section-mid">
        <div className="little-nav-borderbox">
          <div className="little-nav">
            <ul>
              {identity === "buyer" && (
                <>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => handleLinkClick("全部")}
                      className={`link  ${
                        activeLink === "全部" ? "active" : ""
                      }`}
                    >
                      全部
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => handleLinkClick("待出貨")}
                      className={`link ${
                        activeLink === `待出貨` ? `active` : ``
                      }`}
                    >
                      待出貨
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => handleLinkClick("待收貨")}
                      className={`link ${
                        activeLink === `待收貨` ? `active` : ``
                      }`}
                    >
                      待收貨
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => handleLinkClick("已完成")}
                      className={`link ${
                        activeLink === `已完成` ? `active` : ``
                      }`}
                    >
                      已完成
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => handleLinkClick("退貨/退款")}
                      className={`link ${
                        activeLink === `退貨/退款` ? `active` : ``
                      }`}
                    >
                      退貨/退款
                    </Link>
                  </li>
                </>
              )}

              {identity === "seller" && (
                <>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => handleLinkClick("商品")}
                      className={`link  ${
                        activeLink === "商品" ? "active" : ""
                      }`}
                    >
                      商品
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => handleLinkClick("待寄貨")}
                      className={`link ${
                        activeLink === `待寄貨` ? `active` : ``
                      }`}
                    >
                      待寄貨
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => handleLinkClick("已出售")}
                      className={`link ${
                        activeLink === `已出售` ? `active` : ``
                      }`}
                    >
                      已出售
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => handleLinkClick("退貨/換貨")}
                      className={`link ${
                        activeLink === `退貨/換貨` ? `active` : ``
                      }`}
                    >
                      退貨/換貨
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        {/* identity="buyer" */}
        {activeLink === "全部" && (
          <div>
            {orders.map((order) =>
              order.products.map((product) => (
                <div key={product._id} className="shopping-list-unit">
                  <img
                    className="img"
                    src={product.product.imgUrl}
                    alt="商品圖片"
                  />
                  <div className="product-name">
                    【{product.product.title}】
                  </div>
                  <div className="product-description">
                    {product.product.description}
                  </div>
                  <div className="product-number">
                    已購數量 {product.quantity}
                  </div>
                  <div className="product-status">{product.status}</div>
                  <div className="product-unitPrice">
                    總價 ${product.unitPrice * product.quantity}
                  </div>
                  <div className="product-purchaseTime">
                    {formatDate(order.purchaseTime)}
                  </div>
                  {product.status !== "退貨/退款" && (
                    <button onClick={() => handleStatusChange(product._id)}>
                      退貨/退款
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {["待出貨", "待收貨", "已完成", "退貨/退款"].includes(activeLink) && (
          <div>
            {orders.map((order) =>
              order.products
                .filter((product) => product.status === activeLink)
                .map((product) => (
                  <div key={product._id} className="shopping-list-unit">
                    <img
                      className="img"
                      src={product.product.imgUrl}
                      alt="商品圖片"
                    />
                    <div className="product-name">
                      【{product.product.title}】
                    </div>
                    <div className="product-description">
                      {product.product.description}
                    </div>
                    <div className="product-number">
                      {" "}
                      已購數量 {product.quantity}
                    </div>
                    <div className="product-status">{product.status}</div>
                    <div className="product-unitPrice">
                      {" "}
                      總價 ${product.unitPrice * product.quantity}
                    </div>
                    <div className="product-purchaseTime">
                      {formatDate(order.purchaseTime)}
                    </div>
                    {activeLink === "待收貨" && (
                      <button onClick={() => handleStatusChange(product._id)}>
                        已成功取貨
                      </button>
                    )}
                  </div>
                ))
            )}
          </div>
        )}

        {/* 當identity==="seller" */}
        {activeLink === "商品" && (
          <div className="product-bg">
            {productsData.map((product) => (
              <div
                key={product._id}
                className="product-unit"
                title={product.description}
              >
                <img
                  src={product.imgUrl}
                  alt={product.title}
                  className="product-img"
                />
                <div className="product-title">{product.title}</div>
                <div className="product-price">${product.price}</div>
                <div className="product-inventory">
                  庫存量:{product.inventory}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeLink === "待寄貨" && (
          <div>
            {" "}
            {sellerOrders.map((order) =>
              order.products
                .filter(
                  (product) =>
                    product.product !== null && product.status === "待出貨"
                ) // 過濾掉 product 為 null 的項目
                .map((product) => (
                  <div key={product._id} className="shopping-list-unit">
                    <img
                      className="img"
                      src={product.product.imgUrl}
                      alt="商品圖片"
                    />
                    <div className="product-name">
                      【{product.product.title}】
                    </div>
                    <div className="product-description">
                      {product.product.description}
                    </div>
                    <div className="product-number">
                      商品數量 {product.quantity}
                    </div>
                    <div className="product-status">{product.status}</div>
                    <div className="product-unitPrice">
                      總價 ${product.unitPrice * product.quantity}
                    </div>
                    <div className="product-purchaseTime">
                      {formatDate(order.purchaseTime)}
                    </div>
                    <button
                      onClick={() => handleStatusChange(product._id)}
                      style={{ height: "fit-content", width: "fit-content" }}
                    >
                      已寄貨
                    </button>
                  </div>
                ))
            )}
          </div>
        )}
        {activeLink === "已出售" && (
          <div>
            {" "}
            {sellerOrders.map((order) =>
              order.products
                .filter(
                  (product) =>
                    product.product !== null && product.status === "已完成"
                )
                .map((product) => (
                  <div key={product._id} className="shopping-list-unit">
                    <img
                      className="img"
                      src={product.product.imgUrl}
                      alt="商品圖片"
                    />
                    <div className="product-name">
                      【{product.product.title}】
                    </div>
                    <div className="product-description">
                      {product.product.description}
                    </div>
                    <div className="product-number">
                      商品數量:{product.quantity}
                    </div>
                    <div className="product-status">已出售</div>
                    <div className="product-unitPrice">
                      總價 ${product.unitPrice * product.quantity}
                    </div>
                    <div className="product-purchaseTime">
                      {formatDate(order.purchaseTime)}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
        {activeLink === "退貨/換貨" && (
          <div>
            {" "}
            {sellerOrders.map((order) =>
              order.products
                .filter(
                  (product) =>
                    product.product !== null && product.status === "退貨/退款"
                )
                .map((product) => (
                  <div key={product._id} className="shopping-list-unit">
                    <img
                      className="img"
                      src={product.product.imgUrl}
                      alt="商品圖片"
                    />
                    <div className="product-name">
                      【{product.product.title}】
                    </div>
                    <div className="product-description">
                      {product.product.description}
                    </div>
                    <div className="product-number">
                      商品數量:{product.quantity}
                    </div>
                    <div className="product-status">退貨/退款</div>
                    <div className="product-unitPrice">
                      總價 ${product.unitPrice * product.quantity}
                    </div>
                    <div className="product-purchaseTime">
                      {formatDate(order.purchaseTime)}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
      <div className="line"></div>
      <div className="section-right">
        <div className="avatar">
          <div className="avatar-circle">
            <img
              src={
                identity === "buyer"
                  ? currentUser.buyer.avatarUrl
                  : currentUser.seller.sellerAvatarUrl
              }
              alt="您的頭像"
              className="buyer-img"
            />
          </div>
          <button className="edit" disabled={true}>
            編輯
          </button>
        </div>
        <div className="info">
          <p>
            {identity === "buyer"
              ? currentUser.buyer.username
              : currentUser.seller.shopname}
          </p>
          <p>
            {identity === "buyer"
              ? currentUser.buyer.email
              : `目前共有幾項商品: ${numProducts}項`}
          </p>
          <p>
            {identity === "buyer"
              ? ``
              : `有幾項新訂單需要出貨: ${numPendingShipments}項`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
