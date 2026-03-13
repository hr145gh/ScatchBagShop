const express= require("express");
const router= express.Router();

// Home page (User registration)
router.get("/", function(req, res){
    res.render("index", { error: "" });
});

// Owner login page
router.get("/owner", function(req, res){
    res.render("owner-login", { error: "" });
});

// Shop page
router.get("/shop", function(req, res){
    res.redirect("/products");
});

// Cart page
router.get("/cart", function(req, res){
    res.render("cart", { cartItems: [] });
});

module.exports= router;