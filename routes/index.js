const express= require("express");
const router= express.Router();
const isLoggedIn= require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const upload= require("../config/multer-config");
const userModel= require("../models/user-model");

// Home page (User registration)
router.get("/", function(req, res){
    let error= req.flash("error");
    res.render("index", { error , loggedin: false });
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
        let success= req.flash("success");
        res.render("shop", { products: products , success });
    } catch (err) {
        res.send(err.message);
    }
});

router.get("/addtocart/:productid", isLoggedIn, async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
});

// Cart page
router.get("/cart", isLoggedIn, async function(req, res){
    let user= await userModel
        .findOne({email: req.user.email})
        .populate("cart");
    
    const bill = Number(user.cart.price)+ 20 - Number(user.cart.discount);

    res.render("cart", { user, bill });
});

module.exports= router;