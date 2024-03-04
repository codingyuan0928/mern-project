import axios from "axios";
import { useState } from "react";
const API_URL = "http://localhost:8080/api/products";
const auth = JSON.parse(localStorage.getItem("user")).token;

class ProductService {
  post(imgUrl, title, categories, description, inventory, price, shopname) {
    return axios.post(
      API_URL,
      {
        imgUrl,
        title,
        categories,
        description,
        inventory,
        price,
        shopname,
      },
      { headers: { Authorization: auth } }
    );
  }
  patch(buyerId, productId, quantity) {
    return axios.patch(
      `${API_URL}/${buyerId}/${productId}`,
      {
        quantity,
      },
      { headers: { Authorization: auth } }
    );
  }
  async fetchHomepageData(url) {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: auth },
      });
      const parsedData = response.data;
      return parsedData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  purchaseProduct(productId, buyerId, quantityToPurchase) {
    return axios.post(
      `${API_URL}/purchase/${productId}`,
      {
        buyerId: buyerId,
        buyers: {
          quantity: quantityToPurchase,
        },
      },
      {
        headers: { Authorization: auth },
      }
    );
  }
  acquireProductsByShopname(shopname) {
    return axios.get(`${API_URL}/shop/${shopname}`, {
      headers: { Authorization: auth },
    });
  }
}

export default new ProductService();
