const express = require('express');
const router= express.Router();
const productModel = require("../models/product-model");
const upload= require("../config/multer-config");

// Get all products (Shop page)
router.get("/", async function(req, res){
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

// Get admin products page
router.get("/admin", async function(req, res){
    try {
        let products = await productModel.find();
        res.render("admin", { products: products });
    } catch (err) {
        res.send(err.message);
    }
});

// Create new product (admin)
router.post("/create", upload.single("image"), async function(req, res){
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
        
        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        });
        
        // Render the createproducts page with success message
        req.flash("success", "Products created successfully");
        res.render("createproducts", { success: "Product created successfully!" });
    } catch (err) {
        res.render("createproducts", { success: `Error: ${err.message}` });
    }
});

// Delete product
router.get("/delete/:id", async function(req, res){
    try {
        await productModel.findByIdAndDelete(req.params.id);
        res.redirect("/products/admin");
    } catch (err) {
        res.send(err.message);
    }
});

router.get("/shop", function(req, res){
    res.send("Product shop route is working");
});

module.exports= router;