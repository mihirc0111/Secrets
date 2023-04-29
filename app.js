const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
 
const app = express();
 
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//Added by me which is not present in Lecture(IMP !!!!!)
// const request = require("request");
const cors = require('cors')
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors())
// require these installations for env file to protect password(IMP!!!!!)
//npm i require body-parser cors dotenv
 
// mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser: true});
//Connecting to the database using mongoose.
main().catch(err => console.log(err));
async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  await mongoose.connect(MONGODB_URI);
} 


const userSchema = {
    email: String,
    password: String
};
 
const User = new mongoose.model("User", userSchema);
 
 
app.get("/", function (req, res) {
  res.render('home');
});
 
app.get("/login", function(req, res) {
  res.render("login");
});
 
app.get("/register", (req, res)=>{
  res.render("register");
});
 
app.post("/register", (req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
 
    newUser.save()
    .then(function(){
        res.render("secrets");
    })
    .catch(function(err){
        console.log(err);
    })
});
 
app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
 
    User.findOne({email: username})
    .then(function(foundUser){
        if(foundUser.password ===password){
            res.render("secrets");
        }
    })
    .catch(function(err){
        console.log(err);
    })
 
})
 
 
 

//To choose deafault port provided by hosting platform
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function () {
    console.log("Server is running on port 3000 or " + port);
});