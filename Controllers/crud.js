
require('dotenv')

const config = require('../config');
//const client = require('twilio')(config.accountSID, config.authToken);
console.log('accountSID = ',process.env.accountSID);
console.log('serviceID = ',process.env.serviceID);
console.log('token = ',process.env.authToken);
const client = require('twilio')(process.env.accountSID, process.env.authToken);
//const client = require('twilio')('AC78c2cc58be4765d163992bc345472675', 'e31b9ff8f6da2c001ef5d39002bd4cf7');


// get Entreprise
exports.login = (req , res) => {
  
    if (req.query.phonenumber) {
        client
        .verify
        .services(config.serviceID)
        .verifications
        .create({
            to: `+${req.query.phonenumber}`,
            channel: req.query.channel==='call' ? 'call' : 'sms' 
        })
        .then(data => {
            res.status(200).send({
                message: "Verification is sent!!",
                phonenumber: req.query.phonenumber,
                data
            })
        }) 
     } else {
        res.status(400).send({
            message: "Wrong phone number :(",
            phonenumber: req.query.phonenumber,
            data
        })
     }

};

exports.verify = (req , res) => {

    if (req.query.phonenumber && req.query.code.length === 6) {
        client
            .verify
            .services(config.serviceID)
            .verificationChecks
            .create({
                to: `+${req.query.phonenumber}`,
                code: req.query.code
            })
            .then(data => {
                if (data.status === "approved") {
                    res.status(200).send({
                        message: "User is Verified!!",
                        data
                    })
                }
            })
    } else {
        res.status(400).send({
            message: "Wrong phone number or code :(",
            phonenumber: req.query.phonenumber,
            data
        })
    }
}

