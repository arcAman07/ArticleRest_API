const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true,  useUnifiedTopology: true});
const articleSchema = {
  title:String,
  content:String
};
const Article = mongoose.model("Article", articleSchema);
//////// Request targeting all articles/////////////////
app.get("/articles",function(req,res){
  Article.find(function(err,results){
    if (!err){
      res.send(results);

    }
    else {
      res.send(err);
    }
    console.log(results);

  })
});
app.post("/articles",function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added the new Article");
    }
    else {
      res.send(err);
      console.log(err);
    }

  });
});
app.delete("/articles",function(req,res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted the article");
    }
    else {
      res.send(err);
      console.log(err);
    }
  });
});
/////Request for Getting specific articles////////////
app.get("/articles/:articleTitle",function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,results){
    if (!err){
      res.send(results);
      console.log(results);
    }
    else {
      res.send(err);
      console.log(err);
    }

  });
});
/////Request for Put operation on specific articles(it overwrites and updates the entire article(both title and content))/////
app.put("/articles/:articleTitle",function(req,res){
  Article.update({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},{overwrite:true},function(err){
    if (!err){
      res.send("Successfully replaced the article in the database");
    }
    else {
      res.send(err);
      console.log(err);
    }
  });
});
/// Request for patch operation on an article(not overwrting the article,fixing only certain isssues)///////
app.patch("/articles/:articleTitle",function(req,res){
  Article.update({title:req.params.articleTitle},{$set:req.body},function(err){
    if (!err){
      res.send("Successfully patched the article in the database");
    }
    else {
      console.log(err);
      res.send(err);
    }
  });
});
/// Request for deleting a specific article ////
app.delete("/articles/:articleTitle",function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if (!err){
      res.send("Successfully deleted the specific article");
    }
    else {
      console.log(err);
      res.send(err);
    }
  });
});



app.listen(3000,function(){
  console.log("The server is running on port 3000");
});
