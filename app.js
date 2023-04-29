const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

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
 


app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//Connecting to the database using mongoose.
main().catch(err => console.log(err));
async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  await mongoose.connect(MONGODB_URI);
} 

// mongoose.set("useCreateIndex", true);//giving error in our case
//Error: useCreateIndex: "useCreateIndex" is not a valid option to set

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
  });
 
  const secret = "Thisisourlittlesecret.";

  userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
 
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
app.get("/", function (req, res) {
  res.render('home');
});
 
app.get("/login", function(req, res) {
  res.render("login");
});
 
app.get("/register", (req, res)=>{
  res.render("register");
});

app.get("/secrets", function(req, res){
    if (req.isAuthenticated()){
      res.render("secrets");
    } else {
      res.redirect("/login");
    }
  });

  app.get("/logout", function (req,res){
    req.logOut(function(err){
        if (err){
            console.log("##### Error when logging out");
        }else{
            res.redirect("/");        
        }
    });
    
});
 
  app.post("/register", function(req, res){

    User.register({username: req.body.username}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/secrets");
        });
      }
    });
  
  });
 
  app.post("/login", function(req, res){

    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
    req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/secrets");
        });
      }
    });
  
  });
  
 
 
 

//To choose deafault port provided by hosting platform
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function () {
    console.log("Server is running on port 3000 or " + port);
});