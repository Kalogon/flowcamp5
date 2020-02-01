const express = require("express");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const route = require("./routes");
const crawl = require("./crawl_each")
const setUpPassport = require("./setuppassport");

const app = express();
mongoose.connect("mongodb://localhost:27017/finance",{useMongoClient: true});
setUpPassport();
app.set("views",path.join(__dirname,"views"));
var publicDir = require('path').join(__dirname,'/photo');
app.use(express.static(publicDir));


app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
  secret:"TKRvOIJs=HyqrvagQ#&!f!%V]Ww/4KiVs$s,<<MX",
  resave:true,
  saveUninitialized:true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(route);
app.listen(80,function(){
  console.log("Server running at port 80");
});
