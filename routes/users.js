const { User }      = require("../models/user");
const express       = require("express");
const router        = express.Router();
const bcrypt        = require("bcryptjs");
const jwt           = require("jsonwebtoken");


// create user by admin
router.post(`/`, async (req, res) => {
    
    let user = new User({
        name            : req.body.name,
        email           : req.body.email,
        passwordHash    : bcrypt.hashSync(req.body.password, 10),
        phone           : req.body.phone,
        isAdmin         : req.body.isAdmin,
        street          : req.body.street,
        apartment       : req.body.apartment,
        zip             : req.body.zip,
        city            : req.body.city,
        country         : req.body.country,
    })
    // save it to database 
    user = await user.save()
    
    if (!user) return res.status(500).send("the user cannot be created");
    res.send(user);

})

// find all user
router.get(`/`, async (req, res) => {
   
    const userList = await User.find().select('-passwordHash');
    if (!userList) {
        res.status(500).json({success:false})
    }
    res.status(200).send(userList)
})

// find one user
router.get(`/:id`, async (req, res) => {
    const par = req.params.id;
    // console.log(par);
    const user = await User.findById(par).select('-passwordHash');
    if (!user) {
        return res.status(500).json({success:false, message: "the user with given ID could not be found!"})
    }
    res.send(user);
})

// login authentication
router.post(`/login`, async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret
    // check 
    if(!user) {
        return res.status(400).send("The user not found");
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        // return res.status(200).send("User Authenticated");
        // const token = jwt.sign({userId: user.id}, 'secret')
        // const token = jwt.sign({userId: user.id}, secret, {expiresIn: '1d'})
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
            }, 
            secret, 
            {expiresIn: '1d'}
            )

        return res.status(200).send({user: user.email, token: token});


    }else {
        return res.status(400).send("wrong password");
    }
    // return res.status(200).send(user);
})

// create user
router.post(`/register`, async (req, res) => {
    
    let user = new User({
        name            : req.body.name,
        email           : req.body.email,
        passwordHash    : bcrypt.hashSync(req.body.password, 10),
        phone           : req.body.phone,
        isAdmin         : req.body.isAdmin,
        street          : req.body.street,
        apartment       : req.body.apartment,
        zip             : req.body.zip,
        city            : req.body.city,
        country         : req.body.country,
    })
    // save it to database 
    user = await user.save()
    
    if (!user) return res.status(500).send("the user cannot be created");
    res.send(user);

})


// update product
router.put(`/:id`, async (req, res) => {
    const par = req.params.id;
    // console.log(par);
    User.findByIdAndRemove(par)

    if (!mongoose.isValidObjectId(par)) {
        return res.status(400).send("invalid product id");
    }

    const user = await User.findByIdAndUpdate(par, {
        name            : req.body.name,
        email           : req.body.email,
        passwordHash    : bcrypt.hashSync(req.body.password, 10),
        phone           : req.body.phone,
        isAdmin         : req.body.isAdmin,
        street          : req.body.street,
        apartment       : req.body.apartment,
        zip             : req.body.zip,
        city            : req.body.city,
        country         : req.body.country,
    }, {new: true});
    if (!user) {
        return res.status(500).json({success:false, message: "the user with given ID could not be update!"})
    }
    res.send(user);
})



// delete user
router.delete(`/:id`, (req, res) => {
    const par = req.params.id;
    // console.log(par);
    User.findByIdAndRemove(par)
    .then(user => {
        if (user) {
            return res.status(200).json({success:true, message: "the user deleted successfully!"})
        }else {
            return res.status(404).json({success:false, message: "the user could not be found!"})
        }
    })
    .catch(err => {
        return res.status(400).json({success:false, error: err})
    })
})

// count user
router.get(`/get/count`, async (req, res) => {
   
    const userCount = await User.countDocuments();
    console.log(userCount);

    if (!userCount) {
        return res.status(500).json({success:false})
    }
    return res.send({userCount: userCount})
})



module.exports = router