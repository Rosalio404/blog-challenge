//Modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//Variables
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
const homeStartingContent = "This is a blog app I made for a bootcamp challenge. I used the express framework for node, ejs for conditional rendering, and mongoose for interfacing with mongodb. The files for this project's look were provided by the bootcamp this includes the css file, the footer and the header. Besides that the rest was written by me. My plan is to be a full stack developer one day soon. This project was very fun and rewarding to keep moving forward and problem solving on. I hope this project conveys my potential to learn and work with new technologies.";
const aboutContent = "Honestly I said most of what I had to in the home page. So here I'll just say that this was probably my favorite project during the bootcamp as it provided many hurdles to overcome. I really enjoy testing something over and over until it works and this project really gave me that opportunity.";
const contactContent = "In case you're lost you can reach me at rosaliogarciaiv@protonmail.com";

//Mongoose
mongoose.connect("mongodb+srv://admin-rosalio:test123@cluster0.eeqfu.gcp.mongodb.net/blogDB", {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to database");
});

//Schemas
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: {type: Date, default: Date.now},
});
//Models
const Post = new mongoose.model("Post", postSchema);

//Express
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//GET
app.get("/", function(req, res) {
  Post.find(function (err, posts) {
    if (!err) {
      posts.forEach(function (post) {
        post.title = _.startCase(post.title);
      });
      res.render("home", {
        hSC: homeStartingContent,
        posts: posts,
      });
    } else {
      console.error(err);
    }
  });
});

app.get("/posts/:post", function(req, res) {
  const postURL = _.kebabCase(req.params.post);
  Post.findOne({title: postURL}, function (err, post) {
    if (!err) {
      console.log("Match found!");
      res.render("post", {
        title: _.startCase(post.title),
        content: post.content
        });
    } else {
      console.error(err);
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about", {aC: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {cC: contactContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

//POST
app.post("/compose", function(req,res) {
  const post = new Post({
    title: _.kebabCase(req.body.postTitle),
    content: req.body.postBody
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      console.error(err);
    }
  });
});

//Server start
app.listen(port, function() {
  console.log("Server started on port " + port);
});
