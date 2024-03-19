import React, { useState, useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import productsService from "../services/products.service";
import { useHistory } from "react-router-dom";

const UpdateProductsComponent = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [productsData, setProductsData] = useState({
    imgUrl: "",
    title: "",
    categories: "",
    description: "",
    inventory: "",
    price: "",
    shopname: "",
  });
  const [message, setMessage] = useState("");
  const history = useHistory();
  const { currentUser } = props;

  const handleChange = (e, field) => {
    setProductsData((prevProductsData) => ({
      ...prevProductsData,
      [field]: e.target.value,
    }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        // 更新 imgUrl
        setProductsData((prevProductsData) => ({
          ...prevProductsData,
          imgUrl: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileDialog = () => {
    document.getElementById("fileInput").click();
  };

  const postProducts = async () => {
    try {
      const shopname = currentUser?.seller?.shopname;

      if (shopname) {
        await productsService.post(
          productsData.imgUrl,
          productsData.title,
          productsData.categories,
          productsData.description,
          productsData.inventory,
          productsData.price,
          shopname
        );

        window.alert("新商品已儲存成功");
        history.push("/profile");
      } else {
        console.error("無法從 currentUser.seller 中取得 shopname。");
        setMessage("無法確認賣家名稱");
      }
    } catch (error) {
      console.error("Error posting product:", error);
      setMessage(error.response?.data || "無法儲存商品");
    }
  };

  // 使用 useEffect 監聽 productsData 的變化，只有在 productsData 變化時才進行 post 操作
  useEffect(() => {
    if (productsData.shopname) {
      postProducts();
    }
  }, [productsData, currentUser, history]);
  return (
    <div className="update-product-page">
      {message && (
        <div
          className="alert alert-danger"
          style={{
            position: "relative",
            width: "100vw",
            zIndex: "1000",
            top: "-5vh",
            left: "-2.2vw",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
      <div className="product-img-group">
        <label htmlFor="product-img" className="product-img">
          商品圖片:
        </label>
        <div className="img-box" name="product-img" onClick={openFileDialog}>
          <CiImageOn className="icon" />
          <p className="p">{selectedFile ? "重新選取" : "新增圖片"}</p>
          <input
            type="file"
            id="fileInput"
            accept=".jpg, .png, .svg"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          {selectedFile ? null : (
            <p className="comment">(請上傳.jpg/.png/.svg檔案)</p>
          )}
          {previewImage && (
            <img
              src={previewImage}
              alt="相片預覽"
              className="preview-image"
              onChange={(e) => handleChange(e, "imgUrl")}
            />
          )}
          {selectedFile && (
            <div>
              <p className="file-des">
                (檔名: {selectedFile.name}, 類型: {selectedFile.type}, 大小:
                {Math.round(selectedFile.size / 1024)} KB)
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="product-name">
        <label htmlFor="productname">商品名稱:</label>
        <input
          type="text"
          name="productname"
          onChange={(e) => handleChange(e, "title")}
        />
      </div>
      <div className="categories">
        <label htmlFor="categories">商品分類：</label>
        <select
          id="categories"
          name="categories"
          onChange={(e) => handleChange(e, "categories")}
        >
          <option disabled selected>
            請選擇商品種類
          </option>
          <option value="精選">精選</option>
          <option value="雜貨">雜貨</option>
          <option value="電子產品">電子產品</option>
          <option value="電子遊戲">電子遊戲</option>
          <option value="家俱">家俱</option>
          <option value="玩具">玩具</option>
          <option value="嬰兒">嬰兒</option>
          <option value="汽車">汽車</option>
          <option value="電影">電影</option>
          <option value="書籍">書籍</option>
          <option value="健康">健康</option>
          <option value="個人護理">個人護理</option>
          <option value="美妝">美妝</option>
          <option value="寵物">寵物</option>
          <option value="家庭用品">家庭用品</option>
          <option value="運動">運動</option>
          <option value="辦公">辦公</option>
          <option value="慶祝">慶祝</option>
          <option value="藝術">藝術</option>
          <option value="禮品">禮品</option>
          <option value="其他">其他</option>
        </select>
      </div>
      <div className="product-description">
        <label htmlFor="product-des">商品描述:</label>
        <textarea
          name="product-des"
          id="product-des"
          cols="30"
          rows="7"
          placeholder="請敘述外觀、規格及功能等"
          onChange={(e) => handleChange(e, "description")}
        ></textarea>
      </div>
      <div className="products-number">
        <label htmlFor="product-number">商品數量:</label>
        <input
          type="number"
          className="product-number-input"
          onChange={(e) => handleChange(e, "inventory")}
        />
      </div>
      <div className="products-price ">
        <label htmlFor="product-price">商品價格:</label>

        <input
          type="number"
          className="product-price-input"
          onChange={(e) => handleChange(e, "price")}
        />
        <span>(單位:新台幣)</span>
      </div>
      <div className="button-group">
        <button className="cancel">取消</button>
        <button className="selling" onClick={postProducts}>
          儲存商品並上架
        </button>
      </div>
    </div>
  );
};

export default UpdateProductsComponent;
