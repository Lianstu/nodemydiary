var express = require('express');
//生成路由实例
var markdown = require("markdown").markdown
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  Model("Article").find({}).populate("user").exec(function(err,data){
//    if(err){
//      console.log(err)
//    }
//    data.forEach(function (article) {
//      article.content = markdown.toHTML(article.content);
//    });
//    res.render("index",{
//      title:"main",
//      articles:data
//    })
//  })
//});
router.get('/', function(req, res, next) {
  res.redirect('/article/list/1/2');
});

//router.get('/', function(req, res, next) {
//  res.redirect("/article/list/1/2")
//});

module.exports = router;
