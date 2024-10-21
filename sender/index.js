const express = require("express");
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require('cors');
require("dotenv").config();

const app = express();
let mailPort,isSecure

if (process.env.MAIL_SECURE =="TRUE") {
  mailPort = 465
  isSecure = true
  
} else {
  mailPort = 587
  isSecure = false
  
}

app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors())

let mailer = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: mailPort,
  secure: isSecure,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post("/", function (req,res) {
  if(!isAuth(req))
  {
    return res.status(401).send("Request unauthorized");
  }
  mailer.sendMail(
    {
      
      from: process.env.MAIL_ADDRESS,
      to: process.env.MAIL_ADDRESS,
      subject: "New form submission",
      html: `<p>You've got new message from ${req.body.name}(${req.body.email}), who's looking to buy in ${req.body.timeFrame}:</p>
        <p>${req.body.other}</p>`,
    }
    ,
    function (err) {
      if (err) return res.status(500).send(err);
      res.status(200).send("Success");
    }
  );
});
app.listen(process.env.PORT, () =>
  console.log(`Server started at http://localhost:${process.env.PORT}`)
);

const isAuth = (req) =>
{
  const auth = req.headers.authorization

  if(auth && auth.indexOf('Basic ') !== -1)
  {
    const base64Credentials =  auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
  
    if(password==process.env.SERVER_PASSWORD){
      return true
    }
    else
    {
      return false
    }

  }
  else{
    return false
  }
}