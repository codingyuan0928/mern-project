import ProductDisplayComponent from "./product-display-component";
import React from "react";
import LoadingC from "./Loading-component";
const HomeComponent = (props) => {
  const {
    data,
    moreProducts,
    modalOpenIndex,
    setModalOpenIndex,
    handleDifCatProducts,
    hasMoreProducts,
  } = props;

  return (
    <main style={{ minHeight: "100vh" }}>
      <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
        {/* 輪播圖片進度顯示器 */}
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={process.env.PUBLIC_URL + "/pictures/nikes.jpg"}
              className="d-block w-100"
              alt="第一張圖片"
            />

            {/* 輪播圖片上的文字 */}
            <div className="container">
              <div className="carousel-caption">
                <h1>北威開幕禮</h1>
                <p>全商城免運，讓您購物無負擔</p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src={process.env.PUBLIC_URL + "/pictures/rolex.jpg"}
              className="d-block w-100"
              alt="第一張圖片"
            />
            <div className="container">
              <div className="carousel-caption">
                <h1>北威下單最速到貨</h1>
                <p>與全台灣最好的物流合作，讓您節省寶貴的時間~</p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src={process.env.PUBLIC_URL + "/pictures/wedding-ring.jpg"}
              className="d-block w-100"
              alt="第一張圖片"
            />
            <div className="container">
              <div className="carousel-caption ">
                <h1>北威精選</h1>
                <p>無論何種價位的心意都由北威來替您傳遞</p>
              </div>
            </div>
          </div>
        </div>
        {/* 輪播圖片上下一頁按鈕 */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="products-categories">
        <div className="title">商品分類</div>
        <table className="cat ">
          <tbody>
            <tr>
              <td onClick={() => handleDifCatProducts("精選")}>
                <a>精選</a>
              </td>
              <td onClick={() => handleDifCatProducts("雜貨")}>
                <a>雜貨</a>
              </td>
              <td onClick={() => handleDifCatProducts("服飾")}>
                <a>服飾</a>
              </td>
              <td onClick={() => handleDifCatProducts("電子產品")}>
                <a>電子產品</a>
              </td>
              <td onClick={() => handleDifCatProducts("電子遊戲")}>
                <a>電子遊戲</a>
              </td>
              <td onClick={() => handleDifCatProducts("家俱")}>
                <a>家俱</a>
              </td>
              <td onClick={() => handleDifCatProducts("玩具")}>
                <a>玩具</a>
              </td>
              <td onClick={() => handleDifCatProducts("嬰兒")}>
                <a>嬰兒</a>
              </td>
              <td onClick={() => handleDifCatProducts("汽車")}>
                <a>汽車</a>
              </td>
              <td onClick={() => handleDifCatProducts("電影")}>
                <a>電影</a>
              </td>
              <td onClick={() => handleDifCatProducts("書籍")}>
                <a>書籍</a>
              </td>
            </tr>
            <tr>
              <td onClick={() => handleDifCatProducts("健康")}>
                <a>健康</a>
              </td>
              <td onClick={() => handleDifCatProducts("個人護理")}>
                <a>個人護理</a>
              </td>
              <td onClick={() => handleDifCatProducts("美妝")}>
                <a>美妝</a>
              </td>
              <td onClick={() => handleDifCatProducts("寵物")}>
                <a>寵物</a>
              </td>
              <td onClick={() => handleDifCatProducts("家庭用品")}>
                <a>家庭用品</a>
              </td>
              <td onClick={() => handleDifCatProducts("運動")}>
                <a>運動</a>
              </td>
              <td onClick={() => handleDifCatProducts("辦公")}>
                <a>辦公</a>
              </td>
              <td onClick={() => handleDifCatProducts("慶祝")}>
                <a>慶祝</a>
              </td>
              <td onClick={() => handleDifCatProducts("藝術")}>
                <a>藝術</a>
              </td>
              <td onClick={() => handleDifCatProducts("禮品")}>
                <a>禮品</a>
              </td>
              <td onClick={() => handleDifCatProducts("其他")}>
                <a>其他</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="display">
        <div className="title">商品種類</div>

        {data ? (
          <div>
            <ProductDisplayComponent
              data={data}
              modalOpenIndex={modalOpenIndex}
              setModalOpenIndex={setModalOpenIndex}
            />
            <div
              className="moreProducts"
              style={{ display: hasMoreProducts ? "flex" : "none" }}
            >
              <button onClick={moreProducts}>更多商品</button>
            </div>
          </div>
        ) : (
          <div className="spinner-container" style={{ position: "relative" }}>
            <LoadingC />
          </div>
        )}
      </div>
    </main>
  );
};

export default HomeComponent;
