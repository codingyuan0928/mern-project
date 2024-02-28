import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { BsCart2 } from "react-icons/bs";
import { PiUserCircleFill } from "react-icons/pi";
import SearchComponent from "./search-component";
import authService from "../services/auth.service";

const NavBar = (props) => {
  const history = useHistory();
  const [isHovered, setIsHovered] = useState(false);
  const {
    currentUser,
    setCurrentUser,
    identity,
    setIdentity,
    avatar,
    setAvatar,
    currentSearch,
    setCurrentSearch,
    input,
    search,
    setInput,
    searchUrl,
    initialUrl,
    setHasMoreProducts,
  } = props;

  useEffect(() => {
    console.log(currentUser);
    if (currentUser.buyer) {
      setAvatar(currentUser.buyer.avatarUrl);
    }
  }, [currentUser]);
  const handleHover = () => {
    setIsHovered(true);
  };
  const handleLeave = () => {
    setIsHovered(false);
  };

  //導向登入
  const loginFirst = () => {
    window.alert("即將為您導向登入頁面");
    history.push("/login");
  };

  const changeAvatar = (avatarPath) => {
    setAvatar(avatarPath);
  };
  //登出
  const handleLogout = () => {
    authService.logout();
    setAvatar(null);
    setCurrentUser({});
    setIdentity("visitor");
    history.push("/");
  };
  //點選購物車按鈕
  const handleCartLink = () => {
    if (identity === "seller") {
      alert("請先切換成買家身分");
    } else if (identity === "buyer") {
      history.push("/shoppingCart");
    } else {
      alert("查無買家身分，請先登入");
    }
  };
  //點選首頁按鈕
  const resetPage = async () => {
    await search(initialUrl);
    setHasMoreProducts(true);
    console.log("已重新導向首頁");
  };
  return (
    <nav className="nav-container">
      <div className="navBrand">
        <img
          src={process.env.PUBLIC_URL + "/logos/BW.svg"}
          alt="北威logo"
          className="BW"
        />
        <span className="nav-title" onClick={() => resetPage()}>
          <Link to="/" className="a">
            北威購物
          </Link>
        </span>
      </div>

      <div className="nav-links">
        <div>
          <SearchComponent
            setInput={setInput}
            search={search}
            currentSearch={currentSearch}
            setCurrentSearch={setCurrentSearch}
            searchUrl={searchUrl}
            initialUrl={initialUrl}
            input={input}
          />
        </div>
        <div className="nav-option">
          <div className="nav-link">
            <BsCart2
              className="cart"
              title="購物車"
              onClick={handleCartLink}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div
            onClick={() => {
              history.push("/login");
            }}
            className="nav-link"
          >
            <div
              className="dropdown"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
              style={{
                paddingBottom:
                  isHovered && window.innerWidth <= 480 ? "75vw" : null,
                backgroundColor:
                  isHovered && window.innerWidth <= 480 ? "transparent" : null,
                width: isHovered && window.innerWidth <= 480 ? "80vw" : null,
                height: isHovered && window.innerWidth <= 480 ? "15vw" : null,
              }}
            >
              <div className="dropdown-icon">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="選擇的頭像"
                    className="selected-avatar"
                    style={{
                      borderRadius: "180px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      history.push("/profile");
                    }}
                  />
                ) : (
                  <PiUserCircleFill
                    className="info"
                    onClick={loginFirst}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
            </div>
          </div>
          <Link
            to={avatar !== null ? "/" : "/login"}
            className="nav-link"
            id="login"
            onClick={handleLogout}
          >
            {avatar !== null ? "登出" : "登入/註冊"}
          </Link>
        </div>
      </div>
      {isHovered && (
        <div
          className="dropdown-menu"
          onMouseLeave={handleLeave}
          onMouseEnter={handleHover}
          style={{
            right:
              identity !== "visitor" && window.innerWidth > 768 ? "7rem" : null,
          }}
        >
          <ul>
            <li className="title">
              {currentUser.buyer ? "您的身分" : "請登入>>>"}
            </li>
            <li>
              <div
                className="buyer-identity"
                onClick={() => {
                  changeAvatar(currentUser.buyer.avatarUrl);
                  setIdentity("buyer");
                }}
                style={!currentUser.buyer ? { pointerEvents: "none" } : {}}
              >
                <div className="avatar-area">
                  {currentUser.buyer ? (
                    <img src={currentUser.buyer.avatarUrl} alt="買家頭像" />
                  ) : (
                    <PiUserCircleFill className="info" />
                  )}
                </div>
                <div className="buyer-info">
                  <p>優質買家</p>
                  {currentUser.buyer ? (
                    <p>{currentUser.buyer.username}</p>
                  ) : (
                    <p>尚未註冊買家身分</p>
                  )}
                </div>
              </div>
            </li>
            <li>
              <div
                className="seller-identity"
                onClick={() => {
                  if (
                    currentUser.seller &&
                    currentUser.seller.shopname === null
                  ) {
                    history.push("/register");
                  } else {
                    changeAvatar(currentUser.seller.sellerAvatarUrl);
                    setIdentity("seller");
                  }
                }}
                style={!currentUser.seller ? { pointerEvents: "none" } : {}}
              >
                <div className="avatar-area">
                  {currentUser.seller &&
                  currentUser.seller.sellerAvatarUrl !== null ? (
                    <img
                      src={currentUser.seller.sellerAvatarUrl}
                      alt="賣家頭像"
                    />
                  ) : (
                    <PiUserCircleFill className="info" />
                  )}
                </div>
                {currentUser.seller ? (
                  <div className="seller-info">
                    <p>商城賣家</p>
                    <p>
                      {currentUser.seller.shopname == null
                        ? "賣家身分尚未註冊"
                        : currentUser.seller.shopname}
                    </p>
                  </div>
                ) : (
                  <div className="seller-info">
                    <p>商城賣家</p>
                    <p>賣家身分尚未註冊</p>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
