var express = require("express");
var middleware = require("../middleware")
var router = express.Router();
var markdown = require("markdown").markdown
var multer = require('multer');//用于定义文件上传
var path = require('path');
var async = require('async');
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, '../public/uploads')
    },
    filename: function (req, file, cb) {
        //给上传文件重命名，获取添加后缀名
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1))
    }
})
var upload = multer({ storage:storage})  //添加配置文件到muler对象。
var async = require("async")
/*
* 发表文章 article/add 前面不加/article/add
* */
router.get("/add",middleware.checkLogin,function(req,res){
    res.render("article/add",{ "title":"add",article:{} })//artcile:{}向前端传一个空数据
})
//处理提交的文章数据
router.post("/add",upload.single("img"),function (req, res) {
   // console.log("****从编辑的req.body*****",req.body)
    if(req.file){
        req.body.img = path.join('/uploads',req.file.filename);//链接连个path
    }
    var _id = req.body._id;//
    console.log("var _id = req.body._id;",_id)

    if(_id){
        var set = {title:req.body.title,content:req.body.content};
        if(req.file){
            set.img = req.body.img;
        }

        Model('Article').update({_id:_id},{$set:set},function(err,result){
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            req.flash('success', 'update success!');
            res.redirect('/');//注册成功后返回主页
        });
    } else {
        req.body.user = req.session.user._id;//session相当于登陆后拿到了数据库中的信息
        console.log("--------req.body--------",req.body)
        delete req.body._id; // req.body._id="",因为add是抛的是空值
        new Model("Article")(req.body).save(function (err, article) {
            if (err) {
                console.log(err)
                return res.redirect('/article/add')
            }
            req.flash('success', 'publish success!');
            res.redirect("/")
        })
    }

})

router.get("/detail/:_id", function(req,res) {
    async.parallel([function (callback) {
        Model('Article').findOne({_id: req.params._id})
            .populate('user').populate('comments.user')
            .exec(function (err, article) {
                article.content = markdown.toHTML(article.content);
                callback(err, article);
            });
    }, function (callback) {
        Model('Article').update({_id: req.params._id}
            ,{$inc: {pv: 1}}, callback);
    }], function (err, result) {
        if (err) {
            req.flash('error', err);
            res.redirect('back');
        }
        console.log(result)
        res.render('article/detail', {title: '查看文章', article: result[0]});
    });
    //console.log("/detail/:_id--#########",req.params)
    //Model("Article").findOne({_id : req.params._id},function(err,data){
    //    if(err){
    //        console.log(err)
    //    }
    //    data.content = markdown.toHTML(data.content);
    //    res.render('article/detail',{title:'查看文章',article:data});
    //})
})

router.get("/edit/:_id",middleware.checkLogin,function(req,res){
    Model("Article").findOne({_id:req.params._id},function(err,data){
        if(err){
            console.log(err)
        }
        console.log(" =====Model(Article).find===",data)
        res.render("article/add",{ article: data }  )// 得到新的data 并重新交给add页面,就有了数据
    })
})
router.get("/delete/:_id",middleware.checkLogin,function(req,res){
    Model("Article").remove({_id:req.params._id},function(err,data){
        if(err){
            console.log(err)
            res.flash("error",err)
        }
        req.flash("success","delete success");//为什么是req.flash
        res.redirect('/')

    })
})
//分页
router.get('/list/:pageNum/:pageSize',function(req, res, next) {
    var pageNum = req.params.pageNum&&req.params.pageNum>0?
        parseInt(req.params.pageNum):1;
    var pageSize =req.params.pageSize&&req.params.pageSize>0?
        parseInt(req.params.pageSize):2;
    var query = {};
    var searchBtn = req.query.searchBtn;
    var keyword = req.query.keyword;
    if(searchBtn){
        req.session.keyword = keyword;
    }
    if(req.session.keyword){
        query['title'] = new RegExp(req.session.keyword,"i");
    }

    Model('Article').count(query,function(err,count){
        Model('Article').find(query).sort({createAt:-1})
            .skip((pageNum-1)*pageSize)
            .limit(pageSize).populate('user').exec(function(err,articles){
            articles.forEach(function (article) {
                article.content = markdown.toHTML(article.content);
            });
            res.render('index',{
                title:'主页',
                pageNum:pageNum,
                pageSize:pageSize,
                keyword:req.session.keyword,
                totalPage:Math.ceil(count/pageSize),
                articles:articles
            });
        });
    });
});

router.post('/comment',middleware.checkLogin, function (req, res) {
    var user = req.session.user;
    Model('Article').update({_id:req.body._id},
        //push 追加
        {$push:{comments:{user:user._id,content:req.body.content}}},
        function(err,result){
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            req.flash('success', 'comment success!');
            res.redirect('back');
        });
});
module.exports = router;

