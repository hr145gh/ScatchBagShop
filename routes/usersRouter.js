const express = require('express');
const router= express.Router();
const jwt = require("jsonwebtoken");
const {registerUser, loginUser, logout} = require("../controllers/authController");

router.get("/", function(req, res){
    res.send("User route is working");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logout);

module.exports= router;