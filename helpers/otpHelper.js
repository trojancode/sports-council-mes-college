const User = require('../models/user');
const { Order } = require('../models/order');
const request = require('request-promise');

function gOTP() {

    var string = '0123456789';
    let OTP = '';

    // Find the length of string 
    var len = string.length;
    for (let i = 0; i < 6; i++) {
        OTP += string[Math.floor(Math.random() * len)];
    }
    return OTP;
}

exports.generateOTP = (userId) => {
    let otp = gOTP();
    //console.log(otp);
    var ReturnOtp = User.findOneAndUpdate({ _id: userId }, { $set: { otp: otp } }, (err, usr) => {
        if (err) {
            return false
        } else {


            const options = {
                method: 'POST',
                uri: 'https://api.msg91.com/api/v2/sendsms',
                body: {
                    "sender": "SVNMRT",
                    "route": "4",
                    "country": "91",
                    "sms": [
                        {
                            "message": `${otp} is the One Time Password from 7 Mart Groccery App`,
                            "to": [`${usr.phone.substring(2)}`]
                        }
                    ]
                },
                headers: {
                    'authkey': '274503A0h65WGyk775ee11586P1',
                    'Content-Type':'application/json'
                },
                json: true
            }

            request(options)
                .then(function (response) {
                    // Handle the response
                    return true;
                })
                .catch(function (err) {
                    return false;
                    // Deal with the error
                })

        }
    });
    return ReturnOtp;
};

exports.verifyOTP = (userId, OTP) => { //used for deliver verification , user verification , password reset

    let result;

    User.findOne({ $and: [{ _id: userId }, { otp: OTP }] }, (err, usr) => {

        result = usr;
        console.log(userId, OTP, result);
    }).then(() => {
        console.log(result);
        return result;
    });

};

exports.sentDeliveryOTP = (req, res) => {
    // Order.findOne({_id : req.order._id},(err,order)=>{
    //     return res.json(order.user)
    // })
    Order.aggregate([{ $match: { _id: req.order._id } },
    { $lookup: { from: "users", localField: "user", foreignField: '_id', as: "user_details" } },
    { $project: { "user_details.phone": 1, "user_details._id": 1 } }],
        (err, order) => {
            if (!err) {
                let otp = gOTP();
                User.updateOne({ _id: order[0].user_details[0]._id }, { $set: { otp: otp } }, (err, result) => {
                    if (!err) {
                        //deliver otp here
                        return res.json({ msg: "Otp send to User" })
                    }
                })
            }
        })
}