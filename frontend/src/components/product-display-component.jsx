import React from "react";
import LoadingC from "./Loading-component";

const ProductDisplayComponent = (props) => {
  const { data, setModalOpenIndex } = props;

  if (!data.data) {
    return <LoadingC />;
  }

  return (
    <div className="products">
      {data.data && data.data.length > 0 ? (
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
          {data.data && data.data.length === 0 && "目前架上沒有該種類商品!"}
        </div>
      )}
    </div>
  );
};

export default ProductDisplayComponent;
