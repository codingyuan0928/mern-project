import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthService from "../services/auth.service";

const RegisterComponent = (props) => {
  const {
    currentUser,
    setCurrentUser,
    identity,
    setIdentity,
    avatar,
    setAvatar,
  } = props;
  const history = useHistory();
  const avatarInputRef = useRef(null);
  const sellerAvatarInputRef = useRef(null);
  const [userData, setUserData] = useState({
    buyer: {
      avatarUrl: "",
      username: "",
      password: "",
      email: "",
      name: "",
      address: "",
      sex: "",
    },
    seller: {
      sellerAvatarUrl: "",
      shopname: "",
    },
  });
  const [message, setMessage] = useState("");
  const [buyerImageClicked, setBuyerImageClicked] = useState(false);
  const [sellerImageClicked, setSellerImageClicked] = useState(false);
  const [buyerInputDisabled, setBuyerInputDisabled] = useState(false);
  const [sellerInputDisabled, setSellerInputDisabled] = useState(false);
  useEffect(() => {
    window.alert(
      "歡迎註冊成為威寶的一份子~以下為註冊流程:\n1. 註冊成為買家 (必填)\n2. 註冊成為賣家 (選填)\n3. 大肆購物 (⁎˃ᆺ˂)"
    );
  }, []);
  useEffect(() => {
    console.log(currentUser);
    if (currentUser.buyer) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        buyer: {
          ...prevUserData.buyer,
          avatarUrl: currentUser.buyer.avatarUrl || "", // 確保 avatarUrl 不為 null
          username: currentUser.buyer.username || "",
          password: currentUser.buyer.password || "",
          email: currentUser.buyer.email || "",
          name: currentUser.buyer.name || "",
          address: currentUser.buyer.address || "",
          sex: currentUser.buyer.sex || "",
        },
      }));
    }
    if (currentUser.buyer) {
      setBuyerInputDisabled(true);
    }
  }, [currentUser]);
  const handleChange = (e, section, field) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [section]: {
        ...prevUserData[section],
        [field]: e.target.value,
      },
    }));
  };

  const handleBuyerInputDeactivateClick = () => {
    setBuyerInputDisabled((prevValue) => !prevValue);
  };
  const handleSellerInputDeactivateClick = () => {
    setSellerInputDisabled((prevValue) => !prevValue);
  };
  const resetBuyerFields = () => {
    avatarInputRef.current.value = "";
  };
  const handleBuyerCancelRegister = () => {
    window.alert("取消註冊成功，將為您成功導向登入頁面");
    resetBuyerFields();
    history.push("/login");
  };
  const handleFileSelect = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result;
        setUserData((prevUserData) => ({
          ...prevUserData,
          buyer: {
            ...prevUserData.buyer,
            avatarUrl: base64String,
          },
        }));
        setBuyerImageClicked(true);
      };

      reader.readAsDataURL(file);
    }
  };
  const handleSellerFileSelect = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result;
        setUserData((prevUserData) => ({
          ...prevUserData,
          seller: {
            ...prevUserData.seller,
            sellerAvatarUrl: base64String,
          },
        }));
        setSellerImageClicked(true);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleBuyerRegister = () => {
    const {
      avatarUrl,
      username,
      password,
      confirmPassword,
      email,
      name,
      address,
      sex,
    } = userData.buyer;
    if (password !== confirmPassword) {
      window.alert("密碼與確認密碼不同，請重新輸入");
      resetBuyerFields();
      window.location.href = "/register";
      return;
    }
    AuthService.register(
      "post",
      avatarUrl,
      username,
      password,
      email,
      name,
      address,
      sex
    )
      .then(() => {
        window.alert("恭喜您成功註冊買家身分");
        setBuyerInputDisabled((prevValue) => !prevValue);
      })
      .catch((err) => {
        console.log(err.response);
        setMessage(err.response.data);
      });
  };
  const handleSellerRegister = () => {
    const { avatarUrl, username, password, email, name, address, sex } =
      userData.buyer;
    const { sellerAvatarUrl, shopname } = userData.seller;
    AuthService.register(
      "patch",
      avatarUrl,
      username,
      password,
      email,
      name,
      address,
      sex,
      sellerAvatarUrl,
      shopname
    )
      .then(() => {
        setAvatar(null);
        setCurrentUser({});
        setIdentity("visitor");
        window.alert(
          "賣家身分註冊成功，切換身分即可進行購物或販售~即將為您導向登入頁面"
        );
        history.push("/login");
      })
      .catch((err) => {
        console.log(err.response);
        setMessage(err.response.data);
      });
  };
  return (
    <div className="register-page" style={{ Height: "100vh" }}>
      {message && (
        <div
          className="alert alert-danger"
          style={{
            position: "absolute",
            width: "100vw",
            zIndex: "1000",
            top: "17vh",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
      <div className="section-left">
        <div className="customer-img">
          <div className="avatar">點選以新增買家頭像</div>
          <img
            ref={avatarInputRef}
            src={
              currentUser.buyer
                ? currentUser.buyer.avatarUrl
                : userData.buyer.avatarUrl
            }
            style={{
              opacity: currentUser.buyer || buyerImageClicked ? 1 : 0.2,
            }}
            onClick={() => avatarInputRef.current.click()}
            onChange={(e) => handleChange(e, "buyer", "avatarUrl")}
            disabled={buyerInputDisabled}
          />

          <input
            type="file"
            ref={avatarInputRef}
            accept=".jpg, .png, .svg"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            disabled={buyerInputDisabled}
          />

          {currentUser.buyer ? (
            <button className="edit">
              {buyerInputDisabled ? "鎖定中 🔒" : "可編輯 🔓"}
            </button>
          ) : (
            <button className="edit" onClick={handleBuyerInputDeactivateClick}>
              {buyerInputDisabled ? "鎖定中 🔒" : "可編輯 🔓"}
            </button>
          )}
        </div>
        <div className="form-group">
          <div className="username">
            <label htmlFor="username">使用者名稱:</label>
            <input
              type="text"
              name="username"
              value={
                currentUser.buyer
                  ? currentUser.buyer.username
                  : userData.buyer.username
              }
              onChange={(e) => handleChange(e, "buyer", "username")}
              disabled={buyerInputDisabled}
            />
          </div>
          <div className="password">
            <label htmlFor="password"> 密碼:</label>
            <input
              type="password"
              name="password"
              value={
                currentUser.buyer
                  ? currentUser.buyer.password
                  : userData.buyer.password
              }
              onChange={(e) => handleChange(e, "buyer", "password")}
              disabled={buyerInputDisabled}
            />
          </div>
          <div className="confirm-password">
            <label htmlFor="confirm-password">確認密碼:</label>
            <input
              type="password"
              name="confirm-password"
              value={
                currentUser.buyer
                  ? currentUser.buyer.password
                  : userData.buyer.confirmPassword
              }
              onChange={(e) => handleChange(e, "buyer", "confirmPassword")}
              disabled={buyerInputDisabled}
            />
          </div>
          <div className="email">
            <label htmlFor="email">電子信箱:</label>
            <input
              type="email"
              name="email"
              value={
                currentUser.buyer
                  ? currentUser.buyer.email
                  : userData.buyer.email
              }
              onChange={(e) => handleChange(e, "buyer", "email")}
              disabled={buyerInputDisabled}
            />
          </div>
          <div className="name">
            <label htmlFor="address">中文姓名:</label>
            <input
              type="text"
              name="name"
              value={
                currentUser.buyer ? currentUser.buyer.name : userData.buyer.name
              }
              onChange={(e) => {
                handleChange(e, "buyer", "name");
              }}
              disabled={buyerInputDisabled}
            />
          </div>
          <div className="address">
            <label htmlFor="address">居住地址:</label>
            <input
              type="text"
              name="text"
              value={
                currentUser.buyer
                  ? currentUser.buyer.address
                  : userData.buyer.address
              }
              onChange={(e) => {
                handleChange(e, "buyer", "address");
              }}
              disabled={buyerInputDisabled}
            />
          </div>
          <div className="sex">
            <label htmlFor="gender">性別：</label>
            <select
              name="gender"
              onChange={(e) => handleChange(e, "buyer", "sex")}
              disabled={buyerInputDisabled}
            >
              <option value="" disabled selected={!currentUser.buyer && true}>
                請選擇您的性別
              </option>
              <option
                value="男性"
                selected={currentUser.buyer && currentUser.buyer.sex === "男性"}
              >
                男性
              </option>
              <option
                value="女性"
                selected={currentUser.buyer && currentUser.buyer.sex === "女性"}
              >
                女性
              </option>
              <option
                value="其他"
                selected={currentUser.buyer && currentUser.buyer.sex === "其他"}
              >
                其他
              </option>
            </select>
          </div>
        </div>
        <div>
          <button className="register" onClick={handleBuyerRegister}>
            註冊
          </button>
          <button className="cancel" onClick={handleBuyerCancelRegister}>
            取消
          </button>
        </div>
      </div>
      <div className="vertical-line"></div>

      <div className="section-right">
        <div className="seller-img">
          <div className="avatar">點選以新增賣家頭像</div>
          <img
            ref={sellerAvatarInputRef}
            src={userData.seller.sellerAvatarUrl}
            style={{
              opacity: sellerImageClicked ? 1 : 0.2,
            }}
            onClick={() => sellerAvatarInputRef.current.click()}
            onChange={(e) => handleChange(e, "seller", "sellerAvatarUrl")}
            disabled={sellerInputDisabled}
          />
          <input
            type="file"
            ref={sellerAvatarInputRef}
            accept=".jpg, .png, .svg"
            onChange={handleSellerFileSelect}
            style={{ display: "none" }}
            disabled={sellerInputDisabled}
          />
          <button className="edit" onClick={handleSellerInputDeactivateClick}>
            {sellerInputDisabled ? "鎖定中 🔒" : "可編輯 🔓"}
          </button>
        </div>
        <div className="shop-name">
          <label htmlFor="shop-name" style={{ fontSize: "2rem" }}>
            <i className="fi fi-rs-store-alt"></i>:
          </label>
          <input
            type="text"
            name="shopname"
            value={userData.seller.shopname}
            placeholder="請為您的商城命名"
            onChange={(e) => {
              handleChange(e, "seller", "shopname");
            }}
            disabled={sellerInputDisabled}
          />
        </div>
        <div className="products-left">
          <p>
            目前共有幾項商品: <span>0項</span>
          </p>
        </div>
        <div className="new-orders">
          <p>
            有幾項新訂單需要出貨: <span>0項</span>
          </p>
        </div>
        <div className="sell-button">
          <button onClick={handleSellerRegister}>註冊</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
