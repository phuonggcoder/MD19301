const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'quuet00@gmail.com',
      pass: 'azas yucf zbnw trfn'
    }
  });


module.exports = { transporter };
