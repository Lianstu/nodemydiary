var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');//add添加connect-flash 用于重定向
var routes = require('./routes/index');
var users = require('./routes/users');

//add
var article = require("./routes/article")//引入模块
require("./config/datasource")//引入数据层
//生成一个express实例app
var app = express();
/*
*我们可以路由中通过request.session来操作会话对象
 */
var setting = require('./config/production.config');
var session = require('express-session');//引入express-ssession 模块
var MongoStore = require('connect-mongo')(session); //引入connect-mongo 模块
app.use(session({
  secret: setting.cookieSecret,//secret 用来防止篡改 cookie
  key: setting.db,//key 的值为 cookie 的名字
  //设定 cookie 的生存期，这里我们设置 cookie 的生存期为 30 天
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
  resave:true,
  saveUninitialized:true,
  //设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，
  //以避免重启服务器时会话丢失
  store: new MongoStore({
    //db: setting.db,
    //host: setting.host,
    //port: setting.port,
    url:setting.url
  })
}));

//add


// view engine setup
// 设置 views 文件夹为存放视图文件的目录
// 即存放模板文件的地方
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());//add 加载falsh模块,否则下面的use不能使用flash
app.use(function(req,res,next){//add -- 中件间,只有放在最上方next()才会生效
  res.locals.keyword = req.session.keyword;
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));//加载日志中间件
app.use(bodyParser.json());//加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: false }));
//解析urlendcoded url的解析中间件
app.use(cookieParser());//解析cookie的中间件
app.use(express.static(path.join(__dirname, 'public')));
//将public为存放静态文本的中间件

app.use('/', routes); //根路由
app.use('/users', users);//用户路由
app.use("/article",article);//文章路由

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render("404")
});

// error handlers
//add
//app.use(function (err, req, res, next) {
//  var meta = '[' + new Date() + '] ' + req.url + '\n';
//  errorLog.write(meta + err.stack + '\n');
//  next();
//});
// development error handlers 开发环境的错误处理
// / will print stacktrace 打印错误
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler 生产环境的错误处理,
// no stacktraces leaked to user 不向用户暴漏错误
app.use(function(err, req, res, next) {
  //res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app; //导出app 供bin/www 使用
