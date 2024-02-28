import React from "react";

const ProductDisplayComponent = (props) => {
  const { data, modalOpenIndex, setModalOpenIndex } = props;

  return (
    <div className="products">
      {data && data.data && data.data.length > 0 ? (
        data.data.map((product, index) => (
          <div
            key={product._id}
            className="image-container-unit"
            onClick={() => {
              setModalOpenIndex(index);
              document.body.style.overflow = "hidden";
            }}
          >
            <img src={product.imgUrl} alt="" />
            <p className="product-title">{product.title}</p>
            <p className="product-price">${product.price}</p>
          </div>
        ))
      ) : (
        <div
          className="product-error"
          style={{
            backgroundColor: "rgba(255, 0, 0,0.15)",
            borderRadius: "10px",
            padding: "1rem 0.5rem",
            border: "rgba(255,0,0,0.2) solid 0.1px",
            fontSize: "1.5rem",
            margin: "0.5rem",
            color: "rgba(139,0,0)",
          }}
        >
          {data && data.data && data.data.length === 0
            ? "目前架上沒有該種類商品!"
            : "產品資料加載失敗，請重新整理，或稍後再試!!ヾ(￣□￣;)ﾉ"}
        </div>
      )}
    </div>
  );
};

export default ProductDisplayComponent;
