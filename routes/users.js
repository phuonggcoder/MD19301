const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');  // Đảm bảo bạn import đúng mô hình người dùng
const JWT = require('jsonwebtoken');
const config = require("../utill/tokenConfig");


// Lấy tất cả người dùng
router.get('/all', async (req, res) => {
  try {
    var list = await userModel.find(); //  "" -- lay du lieu tuong ung VD: "username"
    // Dùng mô hình userModel để tìm "tất cả"  người dùng
    res.json(list);  // Trả về danh sách người dùng dưới dạng JSON
  } catch (err) {
    res.status(500).json({ message: err.message });  // Trả lỗi nếu có vấn đề
  }
});


//lay thong tin chi tiet cua mot userr

//localhost:3000/users/detail?id=xxxx -- Theo Dang Query
//localhost:3000/users/detail/xxx -- /detail/:id -- Theo Dang params

router.get("/detail/:id", async function (req, res) {
  try {
    const {id} = req.params; //khi co query thi la ?id=xxx(&value2=xxx)
    var detail = await userModel.findById(id);
    if(detail){
      res.status(200).json(detail);
    }else{
      res.status(400).json({status: false,message: "Nót Phao Bốn Trăm"})
    }
  } catch (e) {
    res.status(400).json({status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen"})
  }
});



//lấy danh sách user có tuối lớn hơn X -> gt 
router.get("/get-ds",async function (req,res) {
  try {
    const {tuoi} = req.query;
    var list = await userModel.find({age: {$gt:tuoi}});
    res.status(200).json(list);

  } catch (e) {
    res.status(400).json({status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen"})

  }
  
});

//lấy danh sách user có tuổi từ X đến Y 
router.get("/get-ds-trong-khoang",async function (req,res) {
  try {
    const {min,max} = req.query;
    var list = await userModel.find({age: {$gte:min,$lte:max}});
    res.status(200).json(list);

  } catch (e) {
    res.status(400).json({status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen"})

  }
  
});

//lấy danh sách user có tuổi nhỏ hơn X hoặc lớn hơn Y

router.get("/get-ds-tu-khoang",async function (req,res) {
  try {
    const {min,max} = req.query;
    var list = await userModel.find({$or:[{$lte:min},{$gte:max}]});
    res.status(200).json(list);

  } catch (e) {
    res.status(400).json({status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen"})

  }
  
});

router.post("/login",async function (req, res) {
  try {
    const {user, pass} = req.body;
    const checkUser = await userModel.findOne({username: user, password: pass});
    if (checkUser == null){
      res.status(400).json({status: false ,message:"Ten dang nhap hoac mk khong dung"})
    }else{
      var token = JWT.sign({username:user}, config.SECRETKEY,{expiresIn:'30s'});
      var refreshToken = JWT.sign({username:user}, config.SECRETKEY,{expiresIn:'1d'});
      res.status(200).json({status: true , message:"dang nhap thanh cong", token: token, refreshToken: refreshToken});
    }
  } catch (e) {
    res.status(400).json({status: false ,message:"error"})
  }
})





module.exports = router;



// const { use } = require('.');
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });