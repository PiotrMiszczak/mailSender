const express = require("express");
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");
require('dotenv').config()

const app = express();
app.use(bodyparser.urlencoded({ extended: false }))

let mailer = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user:process.env.MAIL_ADDRESS, 
      pass: process.env.MAIL_PASSWORD, 
    },
    tls: {
      
      rejectUnauthorized: false
  },

  });

  app.post("/", function (req, res) {
    console.log("sending Mail")
    mailer.sendMail(
      {
        from: process.env.MAIL_ADDRESS,
        to: process.env.MAIL_ADDRESS,
        subject: "New form submission",
        html: `<p>You've got new message from ${req.body.name}(${req.body.email}), who's looking to buy in ${req.body.timeFrame}:</p>
        <p>${req.body.other}</p>`,
      },
      function (err) {
        if (err) return res.status(500).send(err)
        res.json({ success: true })
      }
    )
  })
  app.listen(process.env.PORT, ()=>console.log(`Server started at http://localhost:${process.env.PORT}`))

