const express= require('express');
const app= express();
const cookieParser= require("cookie-parser");
const path= require("path");
const ownersRouter= require("./routes/ownersRouter");
const usersRouter= require("./routes/usersRouter");
const productsRouter= require("./routes/productsRouter");

const db= require("./config/mongoose-connection");
const indexRouter = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend/images"))); //this line is for linking frontend
app.set("views", path.join(__dirname, "frontend/views"));    //this line is for linking frontend
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.listen(3000);