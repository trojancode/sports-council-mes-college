const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');

const jwt = require('jsonwebtoken');//for generating signed token
const expressJwt = require('express-jwt');//for authentication check

exports.signup = (req, res) => {
    //console.log(req.body);

    const user = new User(req.body);
    // user.phone=parseInt('91'+user.phone)
    User.findOne({phone:user.email},(err,userexist)=>{
        if(userexist){
            return res.status(400).json({
                error: "User Already Exist With Email",
            })
        }else{
            user.save((err, usr) => {
                if (err) {
                    return res.status(400).json({
                        error: "User Already Exist",
                    })
                }
                usr.salt = undefined
                usr.hashed_password = undefined;
        
                res.json(usr)
            })
        }
    })
};

exports.signin = (req,res) =>{
    //find user based on email
    const {email , password} = req.body
    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(400).json({
                err:"USer with email not found"
            })
        } 
        //if user is found make sure the email and pass match
        //create authenticate method in user model
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"EMail and password dont match"
            });
        }
        // generate a signed token with user id and secret

        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET)
        //persist the token as t in cookie with expiry date

        res.cookie('t',token,{expire:new Date()+9999})
        const { _id, name, email,phone, role } = user
        return res.json({ token, user: { _id, email, name,phone, role } });

    })
};
exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({ message: "Signout Success" })
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});



exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if (!user) {
        return res.status(403).json({
            error: "Access denied"
        })
    }

    next()
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin resource! access denied"
        })
    } else if (req.profile.role === 1) {
        next();
    }

}


