import axios from "axios";

const API_URL = "https://weak-gray-bison-hat.cyclic.app/api/carts";

class CartsService {
  post(userId, shopname, productId, quantity, price) {
    return axios.post(`${API_URL}/${userId}/${shopname}/${productId}`, {
      quantity,
      price,
    });
  }
  getCartItems(userId) {
    return axios.get(`${API_URL}/${userId}`);
  }
  delete(userId, shopname, productId) {
    return axios.delete(`${API_URL}/${userId}/${shopname}/${productId}`);
  }
}

export default new CartsService();
