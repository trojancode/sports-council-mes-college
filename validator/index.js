exports.userSignupValidator = (req, res,next) => {
    req.check('name', 'Name is required').notEmpty()
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min:4,
            max:32
        });
    req.check('phone', 'Phone number is not valid')
        .matches(/^\d+$/)
        .withMessage("The phone is not number")
        .isLength({
            min:10,
            max:10
        })
        .withMessage('Phone must be 10 number');
    req.check('password','Password is required').notEmpty()
    req.check('password')
    .isLength({min:6})
    .withMessage('Password must contain 6 character')
    .matches(/\d/)
    .withMessage("password must contain a number")
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        console.log(req.body.phone);
        
        return res.status(400).json({error:firstError});
    }

    next();

}


exports.userPasswordChangeValidator = (req, res,next) => {
    req.check('password','New Password is required').notEmpty()
    req.check('password')
    .isLength({min:6})
    .withMessage('Password must contain 6 character')
    .matches(/\d/)
    .withMessage("password must contain a number")
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        console.log(req.body.phone);
        
        return res.status(400).json({error:firstError});
    }

    next();

}


