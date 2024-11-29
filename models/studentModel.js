const mongoose = require("mongoose");

//schema = collection
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const student = new schema({
    id:{type:ObjectId},
    MSSV: {type:String},
    HoTen: {type:String},
    DiemTrungBinh: {type:Number},
    BoMon: {type:String},
    Tuoi: {type:Number}
});
module.exports = mongoose.model.student || mongoose.model("student",student);
