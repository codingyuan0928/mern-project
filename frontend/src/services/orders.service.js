import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

class OrdersService {
  async createOrder(buyer, products, totalAmount, status) {
    const orderData = {
      buyer,
      products,
      totalAmount,
      status,
    };

    try {
      const response = await axios.post(API_URL, orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  getBuyerOrder(userId) {
    return axios
      .get(`${API_URL}/${userId}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  }
  getSellerOrder(shopname) {
    return axios
      .get(`${API_URL}/shop/${shopname}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  }
  updateStatus(productId, status) {
    return axios
      .patch(`${API_URL}/product/${productId}`, { status })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  }
}

export default new OrdersService();
