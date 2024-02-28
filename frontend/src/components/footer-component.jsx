import React from "react";

const Footer = () => {
  return (
    <footer className="footer ">
      <div className="footer-container">
        <div className="follow-us">
          <h5 className="h5">關注我們</h5>
          <ul className="ul">
            <li className="li">
              <a href="#">
                <i class="fi fi-brands-facebook fb"></i>
                <h6 className="h6">Facebook</h6>
              </a>
            </li>
            <li className="li">
              <a href="#">
                <i class="fi fi-brands-instagram ig"></i>
                <h6 className="h6">Instagram</h6>
              </a>
            </li>
            <li className="li">
              <a href="#">
                <i class="fi fi-brands-line line"></i>
                <h6 className="h6">Line</h6>
              </a>
            </li>
          </ul>
        </div>
        <div className="customer-service-center">
          <h5 className="h5">客服中心</h5>
          <ul className="ul">
            <li className="li">
              <a href="#">
                <i class="fi fi-rr-interrogation help"></i>
                <h6 className="h6">幫助中心</h6>
              </a>
            </li>
          </ul>
        </div>
        <div className="download-best-way">
          <h5 className="h5">下載北威</h5>
          <div className="download-area">
            <div className="download-qrcode">
              <img
                src={process.env.PUBLIC_URL + "/logos/BWqrcode.svg"}
                alt="北威購物qrcode"
                className="bwqrcode"
              />
            </div>
            <div className="download-list">
              <ul className="ul">
                <li className="li">
                  <a href="">
                    {" "}
                    <i class="fi fi-brands-apple apple"></i>
                    <h6 className="h6">App Store</h6>
                  </a>
                </li>
                <li className="li">
                  <a href="#">
                    <img
                      src={process.env.PUBLIC_URL + "/logos/googleplay.svg"}
                      alt="play商店載點"
                      className="playstore"
                    />
                    <h6 className="h6">Google Play</h6>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <h6 className="h6">© 2024 Leon Chang. All rights reserved.</h6>
      </div>
    </footer>
  );
};

export default Footer;
