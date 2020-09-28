//Modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//Variables
const port = 3000;
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//Mongoose
mongoose.connect("mongodb://localhost/blogDB", {useNewUrlParser: true});
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
