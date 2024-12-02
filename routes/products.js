const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');
const JWT = require("jsonwebtoken");
const config = require("../utill/tokenConfig");

// Middleware kiểm tra token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: 401,
            message: "Thiếu Token"
        });
    }

    JWT.verify(token, config.SECRETKEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                status: 403,
                message: "Token hết hạn hoặc không hợp lệ"
            });
        }
        req.user = decoded; // Lưu thông tin người dùng sau khi xác thực
        next();
    });
};

// Lấy danh sách tất cả các sản phẩm
router.get('/all', verifyToken, async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({
            status: true,
            message: "Thành công",
            products
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            message: "Có lỗi xảy ra. Vui lòng thử lại."
        });
    }
});

// Lấy danh sách tất cả các sản phẩm có số lượng lớn hơn 20
router.get('/all-soluong', verifyToken, async (req, res) => {
    try {
        const products = await productModel.find({ soluong: { $gt: 20 } });
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({
            status: false,
            message: "Có lỗi xảy ra. Vui lòng thử lại."
        });
    }
});

// Lấy danh sách sản phẩm có giá từ 20000 đến 50000
router.get('/ds-gia', verifyToken, async (req, res) => {
    try {
        const products = await productModel.find({
            gia: { $gte: 20000, $lte: 50000 }
        });
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({
            status: false,
            message: "Có lỗi xảy ra. Vui lòng thử lại."
        });
    }
});

// Lấy danh sách sản phẩm có số lượng nhỏ hơn 10 hoặc giá lớn hơn 15000
router.get('/ds-slgia', verifyToken, async (req, res) => {
    try {
        const products = await productModel.find({
            $or: [
                { soluong: { $lte: 10 } },
                { gia: { $gte: 15000 } }
            ]
        });
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({
            status: false,
            message: "Có lỗi xảy ra. Vui lòng thử lại."
        });
    }
});

// Lấy thông tin chi tiết của sản phẩm
router.get('/detail/:masp', verifyToken, async (req, res) => {
    try {
        const { masp } = req.params;
        const product = await productModel.findOne({ masp });
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({
                status: false,
                message: "Không tìm thấy sản phẩm"
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            message: "Có lỗi xảy ra. Vui lòng thử lại."
        });
    }
});

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const productModel = require('../models/productModel');  
// var JWT = require("jsonwebtoken");
// var config= require("../utill/tokenConfig");
// var upload = require("../utill/uploadConfig");

// // Lấy danh sách tất cả các sản phẩm
// router.get('/all', async (req, res) => {
//     try {
//         const token = req.header("Authorization")?.split(' ')[1];
        
//         if (token) {
//             JWT.verify(token, config.SECRETKEY, async function (err, id) {
//                 if (err) {
//                     return res.status(403).json({
//                         "status": 403, 
//                         "message": "Token het han"
//                     });
//                 } else {
//                     const products = await productModel.find({});
//                     return res.status(200).json({
//                         status: true,
//                         message: "Thanh cong",
//                         products
//                     });
//                 }
//             });
//         } else {
//             return res.status(401).json({
//                 "status": 401, 
//                 "message": "Thieu Token"
//             });
//         }
//     } catch (err) {
//         return res.status(400).json({
//             status: false,
//             message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen."
//         });
//     }
// });
  
// // - Lấy danh sách tất cả các sản phẩm có số lượng lớn hơn 20
// router.get('/all-soluong', async (req, res) => {
//     try {
//       const products = await productModel.find({soluong:{$gt:20}});
//       res.status(200).json(products);
//     } catch (err) {
//       res.status(400).json({ status: false,message: "hen" });
//     }
//   });


// // - Lấy danh sách sản phẩm có giá từ 20000 đến 50000
// router.get('/ds-gia', async (req, res) => {
//     try {
//       const products = await productModel.find({
//             gia:{$gte:20000,$lte:50000}
//         });
//       res.status(200).json(products);
//     } catch (err) {
//       res.status(400).json({ status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen" });
//     }
//   });


// // - Lấy danh sách sản phẩm có số lượng nhỏ hơn 10 hoặc giá lớn hơn 15000
// router.get('/ds-slgia', async (req, res) => {
//     try {
//       const products = await productModel.find({
//             $or:[
//                 {soluong:{$lte:10}},
//                 {gia:{$gte:15000}}
//             ]
            
//         });
//       res.status(200).json(products);
//     } catch (err) {
//       res.status(400).json({ status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen" });
//     }
//   });




// // - Lấy thông tin chi tiết của sản phẩm

// router.get('/detail/:masp', async (req, res) => {
//     try {
//       const { masp } = req.params;
//       const product = await productModel.findOne({masp:masp});
//       if (product) {
//         res.status(200).json(product); 
//       } else {
//         res.status(404).json({  status: false,message: "Nót Phao Bốn Trăm"});  
//       }
//     } catch (err) {
//       res.status(400).json({  status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen" });
//     }
//   });

  





  


// module.exports = router;
