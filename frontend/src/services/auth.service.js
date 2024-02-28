import axios from "axios";

const API_URL = "https://weak-gray-bison-hat.cyclic.app/api/user";

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", { email, password });
  }
  logout() {
    localStorage.removeItem("user");
    localStorage.setItem(
      "user",
      JSON.stringify({
        token:
          "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI5MjQ1Mjc5ZjMwODlhYTMyNzhmMzgiLCJlbWFpbCI6Imd1ZXN0MDAxQGZha2UuY29tIiwiaWF0IjoxNzA2NjMyMjk3fQ.AXIP_XZJgsQTYYuFa7TuXQMj-2VV1O-acnf9HlaNs1E",
      })
    );
  }

  register(
    method,
    avatarUrl,
    username,
    password,
    email,
    name,
    address,
    sex,
    sellerAvatarUrl,
    shopname
  ) {
    const url = API_URL + "/register";
    const requestData = {
      buyer: { avatarUrl, username, password, email, name, address, sex },
      seller: { sellerAvatarUrl, shopname },
    };
    const lowercasedMethod = method.toLowerCase();
    if (lowercasedMethod === "post" || lowercasedMethod === "patch") {
      return axios({
        method: lowercasedMethod,
        url: url,
        data: requestData,
      }).catch((error) => {
        console.error(`${lowercasedMethod} error:`, error);
        throw error;
      });
    } else {
      return Promise.reject(new Error(`Invalid method: ${method}`));
    }
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
