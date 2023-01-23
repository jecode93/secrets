//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { appendFile } = require("fs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


//DB Name
const dbname = "userDB";

//DB url
const url = "mongodb://0.0.0.0:27017/";

//DB connections and the database creation
mongoose.set("strictQuery", false);
mongoose.connect(url + dbname, { useNewUrlParser: true });

//Creation of the items Schema
const userSchema = mongoose.Schema({
    email: String,
    password: String
});

//Use the Schema to create the collection model of the database with the singular name.
const User = mongoose.model("User", userSchema);





app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});


//LEVEL 1


//Create or register a user using email and password
app.post("/register", function (req, res) {
    const email = req.body.username;
    const password = req.body.password;

    const newUser = User({
        email: email,
        password: password
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    })

});


//Login using email and password
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    })
})




app.listen(3000, function () {
    console.log("Server listen on port 3000");
})