const mongoose = require("mongoose");

//schema = collection
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const user = new schema({
    id:{type:ObjectId},
    username:{
        type:String
        //require: true -- bat buoc nhap 
        //unique: true -- duy nhat: khi email, sdt, khong duoc trung
        //trim: true -- cat khoang cach cau cuoi
        //min/maxLenght  -- nhap toi thieu
        //defauft: 'No user' -- tro thanh gia tri cua thuoc tinh
    },
    password:{type:String},
    fullname:{type:String},
    age:{type:Number}
});
module.exports = mongoose.model.user || mongoose.model("user",user);
