const router = require('express').Router();
const User = require("../models/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async function(req, res){
    try{

        const {email, password, passwordVerify} = req.body;

        if( !email || !password || !passwordVerify){
            return res.status(400).json({errMessage : "You need to enter all the required feilds"});
        }

        if(password.length < 6){
            return res.status(400).json({errMessage : "Please enter password of atleast 6 characters"});
        }

        if(password != passwordVerify){
            return res.status(400).json({errMessage : "Password is not same as previous typed password"});
        }

        // check if the same email is present in DB
        const existingUser = await User.findOne({email:email});
        if(existingUser){
            return res.status(400).json({errMessage : "Same email id already exists in DB!"});
        }

        // hash password to store in DB
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        // Save user in DB
        const newUser = new User({
            email: email,
            passwordHash: passwordHash
        });

        const savedUser = await newUser.save();
        // res.send(savedUser);

        // create jwt token for cookie

        const token = jwt.sign(
        {
            id : savedUser._id,
        }, 
        process.env.JWT_SIGN_TOKEN
        );

        res.cookie("token", token, {httpOnly: true}).send();

    }catch(err){
        res.status(500).send("Internal Server Error");
    }
});

router.post("/login", async (req, res) => {

    try{
        const {email, password} = req.body;

        if( !email || !password){
            return res.status(400).json({errMessage : "You need to enter all the required feilds"});
        }

        // get user account
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(401).json({errMessage : "Something worng with email or password"});
        }

        // console.log(existingUser.passwordHash)
        const correctPassword = await bcrypt.compare(password, existingUser.passwordHash);
        
        if(!correctPassword){
            return res.status(401).json({errMessage : "Something worng with email or password"});
        }

        const token = jwt.sign(
        {
            id : existingUser._id,
        }, 
          process.env.JWT_SIGN_TOKEN
        );

        res.cookie("token", token, {httpOnly: true}).send();

    }catch(err){
        res.status(500).send("Internal Server Error");
    }

});

router.get("/loggedIn", (req, res) => {
    try{
        const token = req.cookies.token;

        if(!token) return res.json(null);

        const validateUser = jwt.verify(token, process.env.JWT_SIGN_TOKEN);
        res.json(validateUser.id);

    }catch(err){
        return res.json(null);
    }
});

router.get("/logOut", (req,res) =>{
    try{
        res.clearCookie("token").send();
    }catch(err){
        return res.json(null);
    }

});


module.exports = router;