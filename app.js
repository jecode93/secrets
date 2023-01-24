//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { appendFile } = require("fs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


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

userSchema.plugin(passportLocalMongoose);

//To encrypt only our password field in the database. (It's the reason why we use the object : encryptedFields)
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

//Use the Schema to create the collection model of the database with the singular name.
const User = mongoose.model("User", userSchema);

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});


app.get("/secrets", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("secrets");
    }
    else {
        res.redirect("/login");
    }
});

app.get("/logout", function (req, res) {
    req.logOut(function (err) {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/");
});

//LEVEL 1


//Create or register a user using email and password
app.post("/register", function (req, res) {
    const email = req.body.username;
    const password = req.body.password;

    // bcrypt.hash(password, saltRounds, function (err, hash) {
    //     // Store hash in your password DB.
    //     const newUser = User({
    //         email: email,
    //         password: hash
    //     });

    //     newUser.save(function (err) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             res.render("secrets");
    //         }
    //     });
    // });

    User.register({ username: email }, password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate('local')(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });

    // User.register({ email: email, active: false }, password, function (err, user) {
    //     if (err) {
    //         console.log(err);
    //         res.redirect("/register");
    //     }

    //     const authenticate = User.authenticate();
    //     authenticate(email, password, function (err, result) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             res.redirect("/secrets");
    //         }

    //         // Value 'result' is set to false. The user could not be authenticated since the user is not active
    //     });
    // });
});


//Login using email and password
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // User.findOne({ email: username }, function (err, foundUser) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         if (foundUser) {
    //             bcrypt.compare(password, foundUser.password, function (err, result) {
    //                 // result == true
    //                 if (result === true) {

    //                     res.render("secrets");
    //                 }
    //             });

    //         }
    //     }
    // })

    const user = User({
        username: username,
        password: passport
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            })
        }
    })
})




app.listen(3000, function () {
    console.log("Server listen on port 3000");
})