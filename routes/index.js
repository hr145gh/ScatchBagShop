const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const upload = require("../config/multer-config");
const userModel = require("../models/user-model");

// Home page (User registration)
router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

// Owner login page
router.get("/owner", function (req, res) {
    res.render("owner-login", { error: "" });
});

// Shop page
router.get("/shop", isLoggedIn, async function (req, res) {
    try {
        let sortby = req.query.sortby || "popular";
        let products = await productModel.find();

        if (sortby === "newest") {
            products.reverse();
        }
        let success = req.flash("success");
        res.render("shop", { products, success });
    } catch (err) {
        res.send(err.message);
    }
});

// Add to cart
router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        let cartItem = user.cart.find(
            (item) => item.productId.toString() === req.params.productid
        );

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            user.cart.push({
                productId: req.params.productid,
                quantity: 1,
            });
        }

        await user.save();
        req.flash("success", "Added to cart");
        res.redirect("/shop");
    } catch (err) {
        res.send(err.message);
    }
});

// Remove from cart
router.get("/removecart/:productid", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        user.cart = user.cart.filter(
            (item) => item.productId.toString() !== req.params.productid
        );
        await user.save();
        res.redirect("/cart");
    } catch (err) {
        res.send(err.message);
    }
});

// Decrease cart quantity
router.get("/decreasecart/:productid", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        
        let cartItem = user.cart.find(
            (item) => item.productId.toString() === req.params.productid
        );
        
        if (cartItem) {
            if (cartItem.quantity > 1) {
                // Decrease quantity if more than 1
                cartItem.quantity -= 1;
            } else {
                // Remove item if quantity becomes 0
                user.cart = user.cart.filter(
                    (item) => item.productId.toString() !== req.params.productid
                );
            }
        }
        
        await user.save();
        res.redirect("/cart");
    } catch (err) {
        res.send(err.message);
    }
});

// Cart page
router.get("/cart", isLoggedIn, async function (req, res) {
    // These defaults ensure the template ALWAYS gets all required variables
    const defaultRenderData = {
        user: { cart: [] },
        totalMRP: 0,
        totalDiscount: 0,
        platformFee: 20,
        bill: 20,
    };

    try {
        let user = await userModel
            .findOne({ email: req.user.email })
            .populate("cart.productId");

        if (!user) {
            return res.render("cart", defaultRenderData);
        }

        // Filter out cart items where the product was deleted
        user.cart = user.cart.filter((item) => item.productId !== null);

        let totalMRP = 0;
        let totalDiscount = 0;
        const platformFee = 20;

        user.cart.forEach((item) => {
            if (item.productId) {
                totalMRP += Number(item.productId.price) * item.quantity;
                totalDiscount += Number(item.productId.discount || 0) * item.quantity;
            }
        });

        const bill = totalMRP + platformFee - totalDiscount;

        res.render("cart", { user, totalMRP, totalDiscount, platformFee, bill });
    } catch (err) {
        console.error(err);
        res.render("cart", defaultRenderData);
    }
});

module.exports = router;