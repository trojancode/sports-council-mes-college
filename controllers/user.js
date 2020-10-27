const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "user not found"
            })
        }

        req.profile = user;
        next();
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined

    return res.json(req.profile);
}

exports.update = (req, res) => {
    User.findByIdAndUpdate({ _id: req.profile._id }, { $set: { name: req.body.name } }, { new: true }, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: "You are not authorized for this profile"
            })
        }

        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    })
}


exports.updatePassword = (req, res) => {
    let pass = {password:req.body.password};
    let curpass = req.body.currentpassword;
    u = new User(pass)
    User.findById({ _id: req.profile._id }, (err, user) => {
        if (!user.authenticate(curpass)) {
            return res.status(401).json({
                error: "Current password is incorrect",
            });
        }else{
            User.findByIdAndUpdate({_id:req.profile._id},{$set: {salt:u.salt,hashed_password:u.hashed_password}},(er,usr)=>{
                if(er){
                    return res.status(401).json({
                        error: "Password Not Changed",
                    });
                }else{
                    return res.json({msg:"password changed"})
                }
            })
        }
    })
}

exports.listDboy = (req, res) => {
    User.find({ role: 2 }, (err, orders) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(orders)
    })
}

