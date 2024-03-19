import { Switch, Route } from "react-router-dom";
import NavBar from "./components/navbar-component";
import Footer from "./components/footer-component";
import HomeComponent from "./components/home-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";
import ProfileComponent from "./components/profile-component";
import React, { useState, useEffect } from "react";
import UpdateProductsComponent from "./components/update-products-component";
import ShoppingCartComponent from "./components/shopping-cart-component";
import Modal from "./components/modal";
import productsService from "./services/products.service";
const App = () => {
  let [modalOpenIndex, setModalOpenIndex] = useState(null);
  let [identity, setIdentity] = useState("visitor");
  let [currentUser, setCurrentUser] = useState({});
  let [avatar, setAvatar] = useState(null);
  let [input, setInput] = useState("");
  let [data, setData] = useState(null);
  let [page, setPage] = useState(1);
  let [currentSearch, setCurrentSearch] = useState("");
  let [quantity, setQuantity] = useState(1);
  let [hasMoreProducts, setHasMoreProducts] = useState(true);
  const initialUrl = "http://localhost:8080/api/products?page=1&per_page=15";
  const searchUrl = `http://localhost:8080/api/products/findByName/${currentSearch}?page=1&per_page=15`;

  // fetch data from restful api
  const search = async (url, callback) => {
    setData(null);
    try {
      console.log("觸發1次");
      setPage(2);

      const dataFetch = await productsService.fetchHomepageData(url);
      if (dataFetch !== undefined && dataFetch !== null) {
        console.log("Data fetched:", dataFetch);
        if (dataFetch) {
          setData(dataFetch);
          if (dataFetch.data && dataFetch.data.length < 14) {
            setHasMoreProducts(false);
          }
          if (callback) {
            callback(dataFetch);
          }
          console.log("Data state updated:", dataFetch);
        }
      } else {
        console.log("Data does not exist");
      }
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  //load more products
  const moreProducts = async () => {
    console.log("button clicked");
    let newUrl;
    if (input === "") {
      newUrl = `http://localhost:8080/api/products?page=${page}&per_page=15`;
    } else {
      newUrl = `http://localhost:8080/api/products/findByName/${currentSearch}?page=${page}&per_page=15`;
    }
    setPage(page + 1);
    try {
      const parsedData = await productsService.fetchHomepageData(newUrl);
      if (parsedData !== undefined && parsedData !== null) {
        if (parsedData) {
          setData((prevData) => {
            if (parsedData.data && parsedData.data.length > 0) {
              const newData = { data: [...prevData.data, ...parsedData.data] };
              if (parsedData.data && parsedData.data.length < 14) {
                setHasMoreProducts(false);
              }
              return newData;
            } else {
              return prevData;
            }
          });
          console.log(data.data);
          console.log(parsedData.data);
          console.log("Data state updated:", data.data.concat(parsedData.data));
        }
      } else {
        console.log("Data does not exist");
      }
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  //點選不同種類商品
  const handleDifCatProducts = (category) => {
    setData(null);
    const catUrl = `http://localhost:8080/api/products/${category}?page=1&per_page=15`;
    search(catUrl, (filteredData) => {
      setData(filteredData);
    });
  };
  //identity身分設定、user&jwt設定
  useEffect(() => {
    setIdentity("visitor");
    localStorage.setItem(
      "user",
      JSON.stringify({
        token:
          "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI5MjQ1Mjc5ZjMwODlhYTMyNzhmMzgiLCJlbWFpbCI6Imd1ZXN0MDAxQGZha2UuY29tIiwiaWF0IjoxNzA2NjMyMjk3fQ.AXIP_XZJgsQTYYuFa7TuXQMj-2VV1O-acnf9HlaNs1E",
      })
    );

    console.log("current search: ", currentSearch);

    if (currentSearch === "") {
      search(initialUrl);
      setHasMoreProducts(true);
    } else {
      search(searchUrl);
      setHasMoreProducts(true);
    }
  }, [currentSearch, initialUrl, searchUrl]);

  //product amount
  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) =>
      Math.max(parseInt(prevQuantity, 10) + amount, 1)
    );
  };

  return (
    <div className="App">
      <NavBar
        identity={identity}
        setIdentity={setIdentity}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        avatar={avatar}
        setAvatar={setAvatar}
        currentSearch={currentSearch}
        setCurrentSearch={setCurrentSearch}
        input={input}
        setInput={setInput}
        search={search}
        searchUrl={searchUrl}
        initialUrl={initialUrl}
        setHasMoreProducts={setHasMoreProducts}
      />
      <Switch>
        <Route path="/" exact>
          <Modal
            open={modalOpenIndex !== null}
            data={data && data.data && data.data[modalOpenIndex]}
            onClose={() => {
              setModalOpenIndex(null);
              setQuantity(1);
              document.body.style.overflow = "auto";
            }}
            quantity={quantity}
            setQuantity={setQuantity}
            handleQuantityChange={handleQuantityChange}
            currentUser={currentUser}
            identity={identity}
          />
          <HomeComponent
            moreProducts={moreProducts}
            data={data}
            modalOpenIndex={modalOpenIndex}
            setModalOpenIndex={setModalOpenIndex}
            handleDifCatProducts={handleDifCatProducts}
            hasMoreProducts={hasMoreProducts}
          />
        </Route>
        <Route path="/register" exact>
          <RegisterComponent
            setIdentity={setIdentity}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setAvatar={setAvatar}
          />
        </Route>
        <Route path="/login" exact>
          <LoginComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setIdentity={setIdentity}
          />
        </Route>
        <Route path="/profile" exact>
          <ProfileComponent identity={identity} currentUser={currentUser} />
        </Route>
        <Route path="/updateProducts">
          <UpdateProductsComponent currentUser={currentUser} />
        </Route>
        <Route path="/shoppingCart">
          <ShoppingCartComponent currentUser={currentUser} />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
