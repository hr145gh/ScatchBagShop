const express= require("express");
const router= express.Router();
const isLoggedIn= require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const upload= require("../config/multer-config");

// Home page (User registration)
router.get("/", function(req, res){
    let error= req.flash("error");
    res.render("index", { error });
});

// Owner login page
router.get("/owner", function(req, res){
    res.render("owner-login", { error: "" });
});

// Shop page
router.get("/shop", isLoggedIn, async function(req, res){
    try {
        let sortby = req.query.sortby || "popular";
        let products = await productModel.find();
        
        if(sortby === "newest") {
            products.reverse();
        }
        
        res.render("shop", { products: products });
    } catch (err) {
        res.send(err.message);
    }
});

// Cart page
router.get("/cart", function(req, res){
    res.render("cart", { cartItems: [] });
});

module.exports= router;