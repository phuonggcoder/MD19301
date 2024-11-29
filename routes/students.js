const express = require('express');
const router = express.Router();
const studentModel = require('../models/studentModel');  
const upload = require('../utill/uploadConfig');
const sendMail = require('../utill/mailConfig')
/**
 Tạo ra collection SinhVien có các thuộc tính sau: MSSV, Họ tên, Điểm trung bình, Bộ môn, tuổi

 */

//- Lấy toàn bộ danh sách sinh viên
router.get('/all', async (req, res) => {
    try {
      var list = await studentModel.find(); 
      res.json(list);  
    } catch (err) {
      res.status(500).json({ message: err.message }); 
    }
  });

//- Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
router.get('/bomon/:bomon', async (req, res) => {
  try {
      const boMon = req.params.bomon;
      const students = await studentModel.find({ BoMon: boMon });
      res.status(200).json(students);

  } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen" });
  }
});


//- Lấy danh sách sản phẩm có điểm trung bình từ 6.5 đến 8.5
router.get('/dtb', async (req, res) => {
  try {
    const { min, max } = req.query;

    if (isNaN(min) || isNaN(max)) {
      return res.status(400).json({ message: "Vui lòng nhập min và max hợp lệ." });
    }

    const sinhViens = await studentModel.find({
      DiemTrungBinh: { $gte: parseFloat(min), $lte: parseFloat(max) },
    });

    if (sinhViens.length === 0) return res.status(404).json({ message: "Không có sinh viên nào." });

    res.json(sinhViens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




//- Tìm kiếm thông tin của sinh viên theo MSSV
router.get('/maso/:MSSV', async (req, res) => {
    try {
    const {MSSV} = req.params;
    const products = await studentModel.findOne({MSSV:MSSV});
    res.status(200).json(products);
    } catch (err) {
      res.status(400).json({ status: false,message: "Có Lỗi Xảy Ra, Vui Lòng Rì Chai À Ghen" });
    }
  });



  // Thêm mới một sinh viên
  router.post('/add', async (req, res) => {
    try {
      const { MSSV, HoTen, DiemTrungBinh, BoMon, Tuoi } = req.body;
      const newStudent = new studentModel({ MSSV, HoTen, DiemTrungBinh, BoMon, Tuoi });
      const savedStudent = await newStudent.save();
      res.status(200).json(savedStudent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

//Thay đổi thông tin sinh viên theo MSSV
router.put('change/:mssv', async (req, res) => {
  try {
    const { mssv } = req.params;
    const updates = req.body;
    const sinhVien = await studentModel.findOneAndUpdate({ MSSV: mssv }, updates, { new: true });
    if (sinhVien) {
      res.json({ message: 'Cập nhật thành công', sinhVien });
    } else {
      res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Xóa một sinh viên ra khỏi danh sách


router.delete('remove/:mssv', async (req, res) => {
  try {
    const { mssv } = req.params;
    const result = await studentModel.remove({ MSSV: mssv });

    if (result.n > 0) {
      res.json({ message: 'Sinh viên đã được xóa' });
    } else {
      res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy danh sách các sinh viên thuộc BM CNTT và có DTB từ 9.0
router.get('/cntt', async (req, res) => {
  try {
    const students = await studentModel.find({
      BoMon: "CNTT", DiemTrungBinh: { $gte: 9.0 }
    });

    res.status(200).json(students);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Lấy ra danh sách các sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT có điểm trung bình từ 6.5
router.get('/cntt-dtb', async (req, res) => {
  try {
    const students = await studentModel.find({
      BoMon: "CNTT",
      Tuoi: { $gte: 18, $lte: 20 },
      DiemTrungBinh: { $gte: 6.5 }
    });

    res.status(200).json(students);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



//sort 
router.get('/sort', async (req, res) => {
  try {
      const sinhViens = await studentModel.find().sort({ diemTrungBinh: 1 });
      res.json(sinhViens);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});






//find dtb cao nhat
router.get('/dtb-caonhat/:bomon', async (req, res) => {
  try {
    const { bomon } = req.params;
    
    const sinhVien = await studentModel.find({ BoMon: bomon })
      .sort({ DiemTrungBinh: -1 })  
      .limit(1); 

      res.json(sinhVien); 
 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});








  // them email
  router.post("/send-mail", async function(req, res, next){
    try{
      const {to, subject, content} = req.body;
  
  
      const mailOptions = {
        from: "quuet00@gmail.com",
        to: to,
        subject: subject,
        html: content
      };
      await sendMail.transporter.sendMail(mailOptions);
      res.json({ status: 1, message: "Gửi mail thành công"});
    }catch(err){
      res.json({ status: 0, message: "Gửi mail thất bại"});
    }
  });
  
// them file 
  router.post('/upload', [upload.single('image')],
  async (req, res, next) => {
      try {
          const { file } = req;
          if (!file) {
             return res.json({ status: 0, link : "" }); 
          } else {
              const url = `http://localhost:3001/images/${file.filename}`;
              return res.json({ status: 1, url : url });
          }
      } catch (error) {
          console.log('Upload image error: ', error);
          return res.json({status: 0, link : "" });
      }
  });
  


  
  

module.exports = router;

