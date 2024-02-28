import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthService from "../services/auth.service";

const LoginComponent = (props) => {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const {
    currentUser,
    setCurrentUser,
    avatar,
    setAvatar,
    identity,
    setIdentity,
  } = props;
  const history = useHistory();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");
  let [inputMemory, setInputMemory] = useState(true);
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  useEffect(() => {
    // 在 currentUser 更新後執行你的代碼
    console.log(currentUser);
  }, [currentUser]);

  const handleLogin = (e) => {
    if (!inputMemory) {
      e.preventDefault();
      AuthService.login(email, password)
        .then((response) => {
          if (response.data.token) {
            localStorage.setItem(
              "user",
              JSON.stringify({
                token: response.data.token,
                email: response.data.user.buyer.email,
              })
            );
            console.log("成功將使用者資料放進localStorage");
          }
          window.alert("登入成功~即將為您導向買家購物清單!!!");
          setCurrentUser(response.data.user);
          setIdentity("buyer");
          history.push("/profile");
        })
        .catch((error) => {
          console.log(error.response);
          setMessage(error.response.data);
          emailInputRef.current.value = "";
          passwordInputRef.current.value = "";
        });
    }
    if (inputMemory) {
      e.preventDefault();
      AuthService.login(email, password)
        .then((response) => {
          if (response.data.token) {
            localStorage.setItem(
              "user",
              JSON.stringify({
                token: response.data.token,
                email: response.data.user.buyer.email,
              })
            );
            console.log("成功將使用者資料放進localStorage");
          }
          window.alert("登入成功~即將為您導向買家購物清單!!!");
          setCurrentUser(response.data.user);
          setIdentity("buyer");
          history.push("/profile");
        })
        .catch((error) => {
          console.log(error.response);
          setMessage(error.response.data);
        });
    }
  };
  return (
    <div style={{ height: "100vh" }} className="login-page">
      <div className="sec-left">
        <div className="bw-slogan">
          <p className="p">BEST WAY IS TO SHOP HERE</p>
        </div>
      </div>
      <div className="sec-right">
        <div className="login-area">
          <form className="form-signin">
            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}
            <div className="form-floating">
              <input
                ref={emailInputRef}
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                onChange={handleChangeEmail}
              />
              <label htmlFor="floatingInput">電子郵件</label>
            </div>
            <div className="form-floating">
              <input
                ref={passwordInputRef}
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                onChange={handleChangePassword}
              />
              <label htmlFor="floatingPassword">密碼</label>
            </div>

            <div className="checkbox mb-3">
              <label>
                <input
                  type="checkbox"
                  checked={inputMemory}
                  value="remember-me"
                  onChange={(e) => setInputMemory(e.target.checked)}
                />{" "}
                記住我
              </label>
            </div>
            <button
              className="w-30 btn btn-lg btn-dark"
              type="submit"
              onClick={handleLogin}
            >
              登入
            </button>

            <p className="mt-3 mb-3 text-muted">——或——</p>
            <div
              className="g-signin2"
              data-width="300"
              data-height="200"
              data-longtitle="true"
            ></div>
            <p>
              北威新朋友? <a href="/register"> 註冊</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
