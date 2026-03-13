const express = require('express');
const router= express.Router();
const ownerModel= require("../models/owner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

if(process.env.NODE_ENV === "development"){
    router.post("/create", async function(req, res){
        try {
            let owners= await ownerModel.find();
            if(owners.length>0){
                return res
                    .status(501)
                    .send("You don't have permission to create a new owner.");
            }

            let {fullname, email, password} =req.body;

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, async function(err, hash) {
                    let createdOwner= await ownerModel.create({
                        fullname,
                        email,
                        password: hash,
                        isadmin: true
                    });
                    
                    let token = jwt.sign({ email: email }, "secret");
                    res.cookie("token", token);
                    res.status(201).send(createdOwner);
                });
            });
        } catch (err) {
            res.send(err.message);
        }
    });
}

// Owner Login
router.post("/login", async function(req, res){
    try {
        let { email, password } = req.body;
        
        let owner = await ownerModel.findOne({ email: email });
        if (!owner) {
            return res.status(401).render("owner-login", { error: "Invalid email or password" });
        }

        bcrypt.compare(password, owner.password, function(err, result) {
            if (result) {
                let token = jwt.sign({ email: email }, "secret");
                res.cookie("token", token);
                res.redirect("/admin");
            } else {
                res.status(401).render("owner-login", { error: "Invalid email or password" });
            }
        });
    } catch (err) {
        res.send(err.message);
    }
});

// Logout owner
router.get("/logout", function(req, res){
    res.clearCookie("token");
    res.redirect("/");
});

router.get("/", function(req, res){
    res.send("Owner route is working");
});

module.exports= router;