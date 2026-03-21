const userModel= require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken}= require("../utils/generateToken");

module.exports.registerUser = async function(req, res){
    try{
        let {email, password, fullname} = req.body;
        
        // Check if user already exists
        let existingUser = await userModel.findOne({ email: email });
        if(existingUser) {
            return res.status(401).render("index", { error: "User already exists" });
        }

        bcrypt.genSalt(10, function (err, salt){
            bcrypt.hash(password, salt, async function (err, hash){
                if(err) return res.status(500).send(err.message);
                
                let user = await userModel.create({
                    email,
                    password: hash,
                    fullname
                });
                let token = generateToken(user);
                res.cookie("token", token);
                res.status(201).redirect("/shop");
            });
        });
    }
    catch(err){
        res.status(500).render("index", { error: err.message });
    }
};

module.exports.loginUser= async function(req, res){
    try{
        let {email, password} = req.body;
        
        let user = await userModel.findOne({ email: email });
        if(!user) {
            return res.status(401).render("index", { error: "Invalid email or password" });
        }

        bcrypt.compare(password, user.password, function(err, result) {
            if(result) {
                let token = generateToken(user);
                res.cookie("token", token);
                res.redirect("/shop");
            } else {
                res.status(401).render("index", { error: "Invalid email or password" });
            }
        });
    }
    catch(err){
        res.status(500).render("index", { error: err.message });
    }
};

module.exports.logout= function(req, res){
    res.cookie("token", "");
    res.redirect("/");
};