const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');  
var JWT = require("jsonwebtoken");
var config= require("../utill/tokenConfig");


var upload = require("../utill/uploadConfig");
// Tạo một collections có tên là Product: masp, tensp, gia, soluong --> thêm 5 dữ liệu sản phẩm bất kỳ
// Viết một số API sau:

// - Lấy danh sách tất cả các sản phẩm
router.get('/all', async (req, res) => {
  try {
      const authHeader = req.header("Authorization");
      if (!authHeader) {
          return res.status(401).json({ status: 401, message: "Thiếu Authorization header" });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
          return res.status(401).json({ status: 401, message: "Token không hợp lệ" });
      }

      // Xác thực token
      JWT.verify(token, config.SECRETKEY, async (err, decoded) => {
          if (err) {
              return res.status(403).json({ status: 403, error: "Token không hợp lệ", details: err });
          }

          try {
              const products = await productModel.find({});
              res.status(200).json(products);
          } catch (err) {
              res.status(500).json({ status: 500, message: "Lỗi server khi lấy danh sách sản phẩm", details: err });
          }
      });

  } catch (err) {
      res.status(400).json({ status: false, message: "Có lỗi xảy ra, vui lòng thử lại", details: err.message });
  }
});
  
// - Lấy danh sách tất cả các sản phẩm có số lượng lớn hơn 20
router.get('/all-soluong', async (req, res) => {
    try {
      const products = await productModel.find({soluong});
      res.status(200).json(products);
    } catch (err) {
      res.status(400).json({ status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen" });
    }
  });


// - Lấy danh sách sản phẩm có giá từ 20000 đến 50000
router.get('/ds-gia', async (req, res) => {
    try {
      const products = await productModel.find({
            gia:{$gte:20000,$lte:50000}
        });
      res.status(200).json(products);
    } catch (err) {
      res.status(400).json({ status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen" });
    }
  });


// - Lấy danh sách sản phẩm có số lượng nhỏ hơn 10 hoặc giá lớn hơn 15000
router.get('/ds-slgia', async (req, res) => {
    try {
      const products = await productModel.find({
            $or:[
                {soluong:{$lte:10}},
                {gia:{$gte:15000}}
            ]
            
        });
      res.status(200).json(products);
    } catch (err) {
      res.status(400).json({ status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen" });
    }
  });




// - Lấy thông tin chi tiết của sản phẩm

router.get('/detail/:masp', async (req, res) => {
    try {
      const { masp } = req.params;
      const product = await productModel.findOne({masp:masp});
      if (product) {
        res.status(200).json(product); 
      } else {
        res.status(404).json({  status: false,message: "Nót Phao Bốn Trăm"});  
      }
    } catch (err) {
      res.status(400).json({  status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen" });
    }
  });

  





  


module.exports = router;
