//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { appendFile } = require("fs");

const app = express();

app.use(express.static("public"));
app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));







app.listen(3000, function () {
    console.log("Server listen on port 3000");
})