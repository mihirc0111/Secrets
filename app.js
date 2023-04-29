const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
 

// console.log(md5("123456"));

// mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser: true});
//Connecting to the database using mongoose.
main().catch(err => console.log(err));
async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  await mongoose.connect(MONGODB_URI);
} 






const userSchema = new mongoose.Schema ({
    email: String,
    password: String
  });
 
  const secret = "Thisisourlittlesecret.";
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });





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

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
        email: req.body.username,
        password: hash
    });
 
    newUser.save()
    .then(function(){
        res.render("secrets");
    })
    .catch(function(err){
        console.log(err);
    })
});

});
 
app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
 
    User.findOne({email: username})
    .then(function(foundUser){
        // if(foundUser.password ===password){ //However, in this code, the if statement before the bcrypt.compare method is already checking if the plain password matches the hashed password. This is unnecessary because the whole point of hashing passwords is to avoid storing them in plain text, making them more secure.
// Therefore, you can remove the if statement before the bcrypt.compare method and just use the result of the comparison to render the secrets page.

            bcrypt.compare(req.body.password, foundUser.password).then( function(result) {
                if (result == true) {
                  res.render("secrets");}
        })
    // }
})
    .catch(function(err){
        console.log(err);
    })
 
});
 
 
 

//To choose deafault port provided by hosting platform
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function () {
    console.log("Server is running on port 3000 or " + port);
});