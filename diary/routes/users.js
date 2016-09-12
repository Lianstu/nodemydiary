var express = require('express');
var middleware = require("../middleware")
var router = express.Router();
var markdown = require("markdown").markdown
/* GET users listing. */
/*
* 1.用户注册
* */
// ### middleware.checkNotLogin ---需要exports
router.get('/reg', middleware.checkNotLogin,function(req, res) {
    res.render("user/reg",{title:"reg"})
});
//对提交的注册信息进行处理
router.post('/reg', middleware.checkNotLogin ,function(req, res) {
    //检测到没有登陆然后下一个
    var user = req.body;//
    if(user.password != user.repassword){
        req.flash('error','两次输入的密码不一致');
        return res.redirect('/user/reg');
    }
    //由于repassword不需要保存，所以可以删除
    delete user.repassword;
    //对密码进行md5加密
    user.password = md5(user.password);
    user.avatar = "https://secure.gravatar.com/avatar/"+md5(user.email)+"?s=48";//得到用户化身
    //这里可以new Model是因为datasource.js里面把 model 置成了全局的了---注意user是表单提交的数据
    new Model('User')(user).save(function(err,user){
        if(err){
            req.flash('error',err);
            return res.redirect('/user/reg');
        }
        req.session.user = user; //用户信息存入 session,是数据库中的所有信息
        console.log(req.session)
        res.redirect('/');//注册成功后返回主页
    });
});
 /*
 * 2.用户登陆
 * */
 router.get('/login',middleware.checkNotLogin, function(req, res) {
     res.render("user/login",{title:"login"})
 });
//对登陆的提交信息进行处理
router.post('/login',middleware.checkNotLogin, function(req, res) {
    var user = req.body;
    user.password = md5(user.password);
    Model('User').findOne(user,function(err,data){
         console.log("====findOne(user,function(err,data)===",data)
        if(err){
            console.log(err)
        }
        if(data == null  ){
            res.redirect("/user/login")
        }else{
            req.flash("success","login success")
            req.session.user = data;
            res.redirect("/")
        }

    })
});
/*
 * 3.用户退出
 * */
router.get('/logout',middleware.checkLogin, function(req, res) {
    req.session.user = null;//用户信息存入session
    res.redirect("/");//返回主页信息
});
/*
 * 4.md5加密
 * */
function md5(val){
    return require('crypto').createHash('md5').update(val).digest('hex');
}
module.exports = router;
