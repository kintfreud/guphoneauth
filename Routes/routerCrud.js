const CrudCtrl = require("../Controllers/crud");
const express = require("express");
const router = express.Router();
const cors = require("cors");
require("dotenv");

const config = require("../config");
//const client = require('twilio')(config.accountSID, config.authToken);
console.log("accountSID = ", process.env.accountSID);
console.log("serviceID = ", process.env.serviceID);
console.log("token = ", process.env.authToken);
const client = require("twilio")(process.env.accountSID, process.env.authToken);

/** Welcome path */

router.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname + '/index.html'));
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

  //sendTextMessage();
  console.log("accountSID = ", process.env.accountSID);
  console.log("serviceID = ", process.env.serviceID);
  console.log("token = ", process.env.authToken);

  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    "<html><head><title>GU phone auth page version 2</title></head><body><center><h1>Welcome to GU phone Auth version 2!!!...</h1></center></body></html>"
  );
  res.end();
});
/**  */

// router.get('/login', cors(), CrudCtrl.login);
// router.get('/verify', cors(), CrudCtrl.verify);

router.get("/login", cors(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

  if (req.query.phonenumber) {
    client.verify
      .services(config.serviceID)
      .verifications.create({
        to: `+${req.query.phonenumber}`,
        channel: req.query.channel === "call" ? "call" : "sms",
      })
      .then((data) => {
        res.status(200).send({
          message: "Verification is sent!!",
          phonenumber: req.query.phonenumber,
          data,
        });
      });
  } else {
    res.status(400).send({
      message: "Wrong phone number :(",
      phonenumber: req.query.phonenumber,
      data,
    });
  }
});

router.get("/verify", cors(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

  if (req.query.phonenumber && req.query.code.length === 6) {
    client.verify
      .services(config.serviceID)
      .verificationChecks.create({
        to: `+${req.query.phonenumber}`,
        code: req.query.code,
      })
      .then((data) => {
        if (data.status === "approved") {
          res.status(200).send({
            message: "User is Verified!!",
            data,
          });
        }
      });
  } else {
    res.status(400).send({
      message: "Wrong phone number or code :(",
      phonenumber: req.query.phonenumber,
      data,
    });
  }
});

module.exports = router;
