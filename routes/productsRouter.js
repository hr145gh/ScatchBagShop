const express = require('express');
const router= express.Router();
const productModel = require("../models/product-model");

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
router.post("/create", async function(req, res){
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor, image } = req.body;
        
        let product = await productModel.create({
            image,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        });
        
        res.redirect("/products/admin");
    } catch (err) {
        res.send(err.message);
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